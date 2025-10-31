const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const artworks = require('../data/artworks.json');

const firebaseConfig = {
  apiKey: "AIzaSyAIfHAADkFetBGWuEfdniK3-xqzKCkyqrA",
  authDomain: "karigarsetu.firebaseapp.com",
  projectId: "karigarsetu",
  storageBucket: "karigarsetu.firebasestorage.app",
  messagingSenderId: "518096117495",
  appId: "1:518096117495:web:a614379facd82ed4197df2",
  measurementId: "G-MB9M9HC65L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadArtworks() {
  console.log('Starting artwork upload...');
  
  try {
    const artworksRef = collection(db, 'artworks');
    
    for (const artwork of artworks) {
      // Convert numerical id to string and ensure all required fields
      const processedArtwork = {
        ...artwork,
        id: artwork.id.toString(),
        name: artwork.name || 'Untitled',
        description: artwork.description || `Beautiful ${artwork.category} from ${artwork.state}`,
        artistName: artwork.artist,
        stockCount: artwork.stockCount || 10,
        images: artwork.images || [artwork.image],
        reviewsCount: artwork.reviews || 0
      };
      
      // Add to Firestore
      const docRef = await addDoc(artworksRef, processedArtwork);
      console.log(`✅ Uploaded artwork "${artwork.name}" with ID: ${docRef.id}`);
    }
    
    console.log('✨ All artworks uploaded successfully!');
  } catch (error) {
    console.error('❌ Error uploading artworks:', error);
  }
}

// Run the upload
uploadArtworks();