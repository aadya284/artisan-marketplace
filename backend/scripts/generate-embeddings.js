const admin = require('firebase-admin');
const { getCachedEmbedding } = require('./vertex');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

// Initialize Firebase Admin (if not already initialized)
try {
  admin.initializeApp({
    credential: admin.credential.cert(require('./config/serviceAccountKey.json')),
    projectId: 'karigarsetu'
  });
} catch (err) {
  // App already initialized
}

async function generateEmbeddings() {
  try {
    console.log('🔄 Starting embedding generation...');
    
    // Get all artworks
    const artworksSnap = await admin.firestore().collection('artworks').get();
    console.log(`📚 Found ${artworksSnap.size} artworks to process`);

    // Process each artwork
    for (const doc of artworksSnap.docs) {
      try {
        const artwork = doc.data();
        const text = [
          artwork.name || '',
          artwork.description || '',
          artwork.category || '',
          artwork.artistName || artwork.artist || '',
          artwork.state || '',
          artwork.tags?.join(' ') || ''
        ].filter(Boolean).join(' ');

        // Get embedding
        console.log(`🔄 Processing artwork: ${artwork.name || doc.id}`);
        const embedding = await getCachedEmbedding(text, {
          projectId: process.env.GCP_PROJECT,
          location: process.env.GCP_LOCATION,
          model: process.env.VERTEX_MODEL_ID
        });

        // Store in embeddings collection
        await admin.firestore()
          .collection('embeddings')
          .doc(doc.id)
          .set({
            artworkId: doc.id,
            vector: embedding,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

        console.log(`✅ Stored embedding for: ${artwork.name || doc.id}`);
      } catch (err) {
        console.error(`❌ Error processing artwork ${doc.id}:`, err);
        // Continue with next artwork
      }
    }

    console.log('✅ Finished generating embeddings!');
  } catch (err) {
    console.error('❌ Error in embedding generation:', err);
  } finally {
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  generateEmbeddings();
}