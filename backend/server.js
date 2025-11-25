// server.js

const path = require("path");
// Load .env.local placed next to this file (robust regardless of cwd)
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });
// If a .env.local wasn't provided, fall back to .env for local development
if (!process.env.GEMINI_API_KEY) {
  const fallback = path.resolve(__dirname, '.env');
  try {
    require('dotenv').config({ path: fallback });
    console.log(`Loaded fallback env from ${fallback}`);
  } catch (e) {
    // ignore - dotenv will throw only on programming errors
  }
}
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const admin = require("firebase-admin");
const axios = require("axios");
const { LRUCache } = require("lru-cache"); // ✅ Correct import for Node.js v20+ (CommonJS)
// Google Cloud Translation client (v3)
const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const multer = require('multer');
const vertex = require('./vertex');

// -------------------------
// 1️⃣ Express setup
// -------------------------
const app = express();
// Enable CORS for all routes
app.use(cors());

// Simple request logger to help debug 404s from the browser
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} - Host: ${req.headers.host}`);
  next();
});

// Rewrite helper: forward requests from /api/recommendations to /recommendations
// This covers frontend code that might call a relative /api path (Next.js style)
app.use((req, res, next) => {
  if (req.path === '/api/recommendations' || req.path.startsWith('/api/recommendations/')) {
    // preserve query string
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

// Parse JSON bodies and handle parsing errors
app.use(express.json());

// Global error handler for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

// Multer setup for handling multipart/form-data uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } }); // 15MB limit per file

// Endpoint: upload images via backend to Firebase Storage using Admin SDK
// Middleware to verify Firebase Auth token
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

app.post('/upload-artworks', verifyAuth, upload.array('files', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, error: 'No files uploaded' });
    const bucket = admin.storage().bucket('karigarsetu.firebasestorage.app');
    console.log('Using bucket:', bucket.name); // Debug log
    console.log('User:', req.user); // Log authenticated user
    const uploaded = [];
    for (let i = 0; i < req.files.length; i++) {
      const f = req.files[i];
      const filename = `artworks/${Date.now()}_${i}_${f.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const file = bucket.file(filename);
      await file.save(f.buffer, { contentType: f.mimetype });
      // Make the file publicly readable (optional) — safer to generate signed URLs instead
      // await file.makePublic();
      // Generate signed URL
      const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 1000 * 60 * 60 * 24 * 7 }); // 7 days
      uploaded.push(url);
    }
    return res.status(200).json({ success: true, urls: uploaded });
  } catch (err) {
    console.error('Upload to storage failed:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Verify environment variables
console.log("Environment Check:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
console.log("- GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length);

// -------------------------
// 2️⃣ Firebase Admin setup
// -------------------------
const saPath = process.env.FIREBASE_ADMIN_SA_PATH || "./config/serviceAccountKey.json";
// Resolve service account path relative to this file when not absolute
const saPathResolved = path.isAbsolute(saPath) ? saPath : path.resolve(__dirname, saPath);
try {
  let serviceAccount;
  if (fs.existsSync(saPathResolved)) {
    serviceAccount = JSON.parse(fs.readFileSync(saPathResolved, "utf8"));
    console.log("ℹ️ Using service account file:", saPathResolved);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Allow storing the entire JSON in an env var (escaped newlines or plain JSON)
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      console.log("ℹ️ Using FIREBASE_SERVICE_ACCOUNT_KEY from environment");
    } catch (innerErr) {
      // try replacing literal \n sequences with newlines then parse
      const normalized = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n");
      serviceAccount = JSON.parse(normalized);
      console.log("ℹ️ Parsed FIREBASE_SERVICE_ACCOUNT_KEY after normalizing newlines");
    }
  } else {
    throw new Error(`Service account not found at ${saPathResolved} and FIREBASE_SERVICE_ACCOUNT_KEY not set`);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "karigarsetu.firebasestorage.app",
    projectId: "karigarsetu"
  });
  
  // Verify storage is initialized
  const bucket = admin.storage().bucket('karigarsetu.firebasestorage.app');
  console.log("✅ Firebase Admin initialized successfully");
  console.log("📦 Storage bucket configured:", bucket.name);
} catch (error) {
  console.error("❌ Error initializing Firebase Admin:", error.message);
}

// -------------------------
// 3️⃣ LRU Cache setup (for saving responses)
// -------------------------
const cache = new LRUCache({
  max: 100, // cache up to 100 responses
  ttl: 1000 * 60 * 10, // cache for 10 minutes
});

// -------------------------
// 4️⃣ Mini RAG (local artisan data)
// -------------------------
let artisanData = [];
try {
  artisanData = JSON.parse(fs.readFileSync("./data/artisans.json", "utf8"));
  console.log(`📚 Loaded ${artisanData.length} artisan records for RAG.`);
} catch (err) {
  console.log("⚠️ No artisans.json found — continuing without local RAG data.");
}

// -------------------------
// Helper: Retry with exponential backoff
// -------------------------
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let retries = 0;
  let delay = initialDelay;

  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries === maxRetries) throw error;

      // Only retry on 503 Service Unavailable or 429 Too Many Requests
      if (error.response?.status !== 503 && error.response?.status !== 429) {
        throw error;
      }

      console.log(`Attempt ${retries} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// -------------------------
// Helper: Call Gemini API with different models
// -------------------------
async function callGeminiAPI(payload, apiKey, models = ['gemini-flash-latest', 'gemini-pro-latest', 'gemini-2.5-flash']) {
  let lastError;

  for (const model of models) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      console.log(`🔄 Trying model: ${model}`);

      const response = await retryWithBackoff(() => 
        axios.post(apiUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          validateStatus: false
        })
      );

      if (response.status === 200) {
        return response;
      }

      lastError = new Error(`${model} returned status ${response.status}`);
    } catch (error) {
      console.error(`❌ Error with model ${model}:`, error.message);
      lastError = error;
    }
  }

  throw lastError;
}

// -------------------------
// 5️⃣ Gemini Chat Endpoint
// -------------------------
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!message) return res.status(400).json({ error: "Message is required" });
  if (!apiKey) return res.status(500).json({ error: "Missing Gemini API key." });

  // ✅ Step 1: Check cache
  if (cache.has(message)) {
    console.log("💾 Cache hit for:", message);
    return res.json({ reply: cache.get(message) });
  }

  // ✅ Step 2: Mini-RAG (retrieve related artisan data)
  const relatedArtisans = artisanData
    .filter((a) => a.description?.toLowerCase().includes(message.toLowerCase()))
    .slice(0, 3)
    .map((a) => `${a.name} (${a.artType}) from ${a.city}`);

  const context = relatedArtisans.length
    ? `Here are some related artisans: ${relatedArtisans.join(", ")}.`
    : "No specific artisan matches found — reply generally.";

    // ✅ Step 3: Call Gemini API
    try {
      console.log("🔄 Starting Gemini API call...");
      console.log("🔑 API Key length:", apiKey?.length || 0);
      console.log("🔑 API Key first 4 chars:", apiKey?.substring(0, 4));

      // generateContent expects a `contents` array with `parts`
      // Add an explicit system instruction telling the model NOT to include introductions
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `SYSTEM INSTRUCTION: You are Kalabandhu, an AI assistant for KarigarSetu — a platform helping local artisans reach buyers. IMPORTANT: Do NOT include any greetings, introductions, or self-identification in your reply (for example, do not start with "Hello! I am Kalabandhu..."). Provide only the concise answer to the user's question.\n\nContext: ${context}\nUser message: "${message}"\nAnswer:`
              }
            ]
          }
        ]
      };

      console.log("📦 Request payload:", JSON.stringify(payload, null, 2));
      
      const response = await callGeminiAPI(payload, apiKey);    console.log("📥 Response status:", response.status);
    console.log("📥 Response data:", JSON.stringify(response.data, null, 2));

    if (response.status !== 200) {
      console.error("❌ Gemini API Error:", JSON.stringify(response.data, null, 2));
      throw new Error(`Gemini API returned status ${response.status}: ${JSON.stringify(response.data)}`);
    }

  // Try a few common response shapes to extract text cleanly
    let reply = "I'm sorry, I couldn't process that right now.";
    try {
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        reply = response.data.candidates[0].content.parts[0].text;
      } else if (response.data?.candidates?.[0]?.output) {
        reply = response.data.candidates[0].output;
      } else if (response.data?.result?.content?.[0]?.text) {
        reply = response.data.result.content[0].text;
      } else if (response.data?.output?.[0]?.content?.[0]?.text) {
        reply = response.data.output[0].content[0].text;
      } else if (typeof response.data === 'string') {
        reply = response.data;
      } else {
        // fallback to JSON string for debugging
        reply = JSON.stringify(response.data);
      }
    } catch (e) {
      console.error("❌ Error extracting reply:", e);
      reply = "I'm sorry, I couldn't process that right now.";
    }

    // Post-process: strip repeated Kalabandhu introductions if model still prefixes them
    try {
      reply = reply.replace(/^\s*(Hello[^\n.!?]*[\.!?]\s*)+/i, "");
      reply = reply.replace(/^\s*(I am Kalabandhu[^\n\.!?]*[\.!?]\s*)+/i, "");
      reply = reply.replace(/^\s*(I am Kalabandhu, the AI assistant for KarigarSetu[^\n\.!?]*[\.!?]\s*)+/i, "");
      reply = reply.trim();
      if (!reply) {
        reply = "I'm sorry, I couldn't process that right now.";
      }
    } catch (e) {
      console.error("❌ Error post-processing reply:", e);
    }

    // ✅ Step 4: Cache the response
    cache.set(message, reply);

    // Ensure we're sending a proper JSON response
    return res.status(200).json({ 
      success: true,
      reply: reply 
    });
  } catch (error) {
    console.error("❌ Detailed error:", error);
    
    // Log detailed error information
    if (error.response) {
      console.error("❌ Error Data:", error.response.data);
      console.error("❌ Error Status:", error.response.status);
      console.error("❌ Error Headers:", error.response.headers);
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    } else {
      console.error("❌ Error setting up request:", error.message);
    }
    
    // Ensure we're sending a proper error response
    return res.status(500).json({
      success: false,
      error: "Failed to process request",
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// -------------------------
// 6️⃣ Verify ID Token route
// -------------------------
app.post("/verify-token", async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ 
        success: false,
        error: "No ID token provided" 
      });
    }

    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      console.log("✅ Verified user:", decoded.email);
      return res.status(200).json({
        success: true,
        message: "User verified successfully",
        user: decoded
      });
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ 
        success: false,
        error: "Invalid or expired token"
      });
    }
  } catch (error) {
    console.error("❌ Verification error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Internal server error during verification" 
    });
  }
});

// -------------------------
// 7️⃣ Clear Cache Endpoint
// -------------------------
app.post("/clear-cache", (req, res) => {
  cache.clear();
  res.json({ 
    success: true,
    message: "✅ Chat cache cleared successfully." 
  });
});

// -------------------------
// Debug: List available models (temporary)
// -------------------------
app.get("/list-models", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing Gemini API key." });
  try {
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models";
    const response = await axios.get(apiUrl, { headers: { "x-goog-api-key": apiKey }, validateStatus: false });
    console.log("📚 List models status:", response.status);
    console.log("📚 List models data:", JSON.stringify(response.data, null, 2));
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("❌ List models error:", err);
    res.status(500).json({ error: "Failed to list models", details: err.message || err });
  }
});

// -------------------------
// 7️⃣ Health route (for testing)
// -------------------------
// -------------------------
// 9️⃣ Google Translate endpoint
// -------------------------
app.post('/translate', async (req, res) => {
  try {
    const { text, target } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'text is required' });

    // Mode A: API key via TRANSLATE_API_KEY (simpler, less permissions work for quick tests)
    const apiKey = process.env.TRANSLATE_API_KEY;
    if (apiKey) {
      try {
        console.log('ℹ️ Using TRANSLATE_API_KEY for translation (REST v2)');
        const contents = Array.isArray(text) ? text : [String(text)];
        const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
        const body = {
          q: contents,
          target: target || 'en',
          format: 'text'
        };

        const response = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
        const translations = (response.data?.data?.translations || []).map(t => t.translatedText || '');
        // Diagnostic logging when counts mismatch
        if (translations.length !== contents.length) {
          console.warn(`⚠️ Translate (API key) returned ${translations.length} translations for ${contents.length} inputs`);
          console.warn('⚠️ Response data preview:', JSON.stringify(response.data?.data?.translations?.slice(0,5) || response.data, null, 2));
        }
        return res.status(200).json({ success: true, translations, sentCount: contents.length, translationsCount: translations.length });
      } catch (err) {
        console.error('❌ Translate (API key) error:', err.response?.data || err.message || err);
        return res.status(500).json({ success: false, error: err.response?.data?.error?.message || err.message || String(err) });
      }
    }

    // Mode B: fallback to using service account JSON via TranslationServiceClient (v3)
    const saPath = process.env.FIREBASE_ADMIN_SA_PATH || './config/serviceAccountKey.json';
    const saPathResolved = path.isAbsolute(saPath) ? saPath : path.resolve(__dirname, saPath);
    let creds = null;
    if (fs.existsSync(saPathResolved)) {
      creds = JSON.parse(fs.readFileSync(saPathResolved, 'utf8'));
      console.log('ℹ️ Using service account for translation:', saPathResolved);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        console.log('ℹ️ Using FIREBASE_SERVICE_ACCOUNT_KEY env for translation');
      } catch (e) {
        const normalized = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n');
        creds = JSON.parse(normalized);
        console.log('ℹ️ Parsed FIREBASE_SERVICE_ACCOUNT_KEY after normalizing newlines for translation');
      }
    } else {
      return res.status(500).json({ success: false, error: 'Service account not found for translation' });
    }

    const projectId = creds.project_id;
    if (!projectId) return res.status(500).json({ success: false, error: 'project_id not found in service account' });

    const client = new TranslationServiceClient({ credentials: creds, projectId });
    const parent = `projects/${projectId}/locations/global`;

    const contents = Array.isArray(text) ? text : [String(text)];

    const [response] = await client.translateText({
      parent,
      contents,
      mimeType: 'text/plain',
      targetLanguageCode: target || 'en'
    });

    const translations = (response.translations || []).map(t => t.translatedText || '');
    if (translations.length !== contents.length) {
      console.warn(`⚠️ TranslationServiceClient returned ${translations.length} translations for ${contents.length} inputs`);
      try { console.warn('⚠️ Sample translations:', translations.slice(0,5)); } catch (e) {}
    }
    return res.status(200).json({ success: true, translations, sentCount: contents.length, translationsCount: translations.length });
  } catch (error) {
    console.error('❌ Translate error:', error?.message || error);
    return res.status(500).json({ success: false, error: error?.message || String(error) });
  }
});
// -------------------------
// Recommendations endpoint
// -------------------------
app.get('/recommendations', async (req, res) => {
  try {
    const artworkId = req.query.artworkId;
    if (!artworkId) return res.status(400).json({ success: false, error: 'artworkId query param is required' });

    // Try to resolve the artwork by several strategies:
    // 1) treat artworkId as a document id
    // 2) treat artworkId as a numeric or string field `id` on the document
    // 3) try other common fields like `artworkId` or `externalId`
    const artworksRef = admin.firestore().collection('artworks');

    let artwork = null;

    // 1) direct doc lookup
    try {
      const artworkDoc = await artworksRef.doc(String(artworkId)).get();
      if (artworkDoc.exists) {
        artwork = { id: artworkDoc.id, ...artworkDoc.data() };
        console.log('Found artwork by doc id:', artwork.id);
      }
    } catch (e) {
      console.warn('Direct doc lookup failed:', e?.message || e);
    }

    // 2) lookup by field `id` (string or number)
    if (!artwork) {
      try {
        let qs = await artworksRef.where('id', '==', artworkId).limit(1).get();
        if (qs.empty && !isNaN(Number(artworkId))) {
          qs = await artworksRef.where('id', '==', Number(artworkId)).limit(1).get();
        }
        if (!qs.empty) {
          const d = qs.docs[0];
          artwork = { id: d.id, ...d.data() };
          console.log('Found artwork by field id:', artwork.id);
        }
      } catch (e) {
        console.warn('Field id lookup failed:', e?.message || e);
      }
    }

    // 3) other possible identifying fields
    if (!artwork) {
      try {
        let qs = await artworksRef.where('artworkId', '==', artworkId).limit(1).get();
        if (qs.empty) qs = await artworksRef.where('externalId', '==', artworkId).limit(1).get();
        if (!qs.empty) {
          const d = qs.docs[0];
          artwork = { id: d.id, ...d.data() };
          console.log('Found artwork by artworkId/externalId field:', artwork.id);
        }
      } catch (e) {
        console.warn('artworkId/externalId lookup failed:', e?.message || e);
      }
    }

    if (!artwork) {
      return res.status(404).json({ success: false, error: 'Artwork not found' });
    }

    try {
      // Try to get recommendations using Vertex AI
      const recommendations = await require('./recommendations').getRecommendations(artwork);
      
      if (recommendations && recommendations.length > 0) {
        return res.json({ 
          success: true, 
          recommendations,
          source: 'vertex-ai'
        });
      }
    } catch (err) {
      console.error('Vertex AI recommendations failed, falling back to category-based:', err);
    }

    // Fallback to category-based recommendations
    const allSnap = await admin.firestore().collection('artworks').get();
    const allArtworks = allSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(a => a.id !== artwork.id); // Exclude the current artwork

    const fallbackRecs = await require('./recommendations').getFallbackRecommendations(artwork, allArtworks);
    
    return res.json({
      success: true,
      recommendations: fallbackRecs,
      source: 'category-based'
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 KarigarSetu backend running successfully!");
});

// -------------------------
// 8️⃣ Start the server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 KarigarSetu backend running at http://localhost:${PORT}`);
});
