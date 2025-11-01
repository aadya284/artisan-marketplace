const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

// Use the vertex helper in backend
const vertex = require('../backend/vertex');

async function main() {
  // Resolve service account path (same behavior as server.js)
  const saPath = process.env.FIREBASE_ADMIN_SA_PATH || path.resolve(__dirname, '../src/config/serviceAccountKey.json');
  let serviceAccount = null;
  if (fs.existsSync(saPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    console.log('Using service account:', saPath);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      console.log('Using service account from FIREBASE_SERVICE_ACCOUNT_KEY');
    } catch (e) {
      const normalized = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n');
      serviceAccount = JSON.parse(normalized);
      console.log('Parsed service account from FIREBASE_SERVICE_ACCOUNT_KEY');
    }
  } else {
    console.error('No Firebase service account found. Set FIREBASE_ADMIN_SA_PATH or FIREBASE_SERVICE_ACCOUNT_KEY.');
    process.exit(1);
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: serviceAccount.project_id });
  const db = admin.firestore();

  const projectId = process.env.VERTEX_PROJECT || serviceAccount.project_id;
  const location = process.env.VERTEX_LOCATION || 'us-central1';
  const model = process.env.VERTEX_EMBEDDING_MODEL;

  if (!model) {
    console.error('VERTEX_EMBEDDING_MODEL not set. Set environment variable to the embedding model name.');
    process.exit(1);
  }

  console.log('Fetching artworks...');
  const artworksSnap = await db.collection('artworks').get();
  console.log('Found', artworksSnap.size, 'artworks');

  let count = 0;
  for (const doc of artworksSnap.docs) {
    const data = doc.data();
    const text = `${data.name || ''} ${data.description || ''} ${data.category || ''} ${data.artistName || data.artist || ''}`.trim();
    try {
      console.log(`Embedding artwork ${doc.id} - ${data.name}`);
      const embedding = await vertex.embedText({ projectId, location, model, text });
      if (!Array.isArray(embedding)) {
        console.warn('Unexpected embedding shape for', doc.id, embedding);
        continue;
      }

      await db.collection('embeddings').doc(doc.id).set({
        artworkId: doc.id,
        vector: embedding,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        name: data.name || null
      });
      count++;
    } catch (err) {
      console.error('Failed embedding for', doc.id, err?.message || err);
    }
  }

  console.log(`✅ Completed embeddings. Wrote ${count} vectors to 'embeddings' collection.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
