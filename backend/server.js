// server.js

// -------------------
// 1️⃣ Imports
// -------------------
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const admin = require("firebase-admin");

// -------------------
// 2️⃣ App setup
// -------------------
const app = express();
app.use(cors());
app.use(express.json());

// -------------------
// 3️⃣ Initialize Firebase Admin SDK
// -------------------
const saPath = process.env.FIREBASE_ADMIN_SA_PATH || "./config/serviceAccountKey.json";

try {
  const serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firebase Admin:", error.message);
}

// -------------------
// 4️⃣ Health route (test)
// -------------------
app.get("/", (req, res) => {
  res.send("KarigarSetu backend running ✅");
});

// -------------------
// 5️⃣ Verify ID Token route (from frontend Firebase Auth)
// -------------------
app.post("/verify-token", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "No ID token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log("✅ Verified user:", decoded.email);
    res.status(200).json({
      message: "User verified successfully",
      user: decoded,
    });
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// -------------------
// 6️⃣ Protected example route (optional)
// -------------------
const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!idToken) return res.status(401).json({ error: "Missing Authorization token" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

app.get("/artisan/dashboard", verifyAuth, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.email}!`,
    role: "artisan",
  });
});

// -------------------
// 7️⃣ Start the server
// -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
