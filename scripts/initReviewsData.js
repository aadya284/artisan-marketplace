const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Sample review templates with varied comments for different art forms
const reviewTemplates = [
  {
    userName: "Priya Sharma",
    userImage: "https://images.unsplash.com/photo-1494790108755-2616b4e2d81d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    ratingRange: [4, 5],
    comments: [
      "Absolutely beautiful piece! The craftsmanship is exceptional and the attention to detail is remarkable. I'm very happy with this purchase.",
      "Stunning artwork that perfectly captures traditional Indian artistry. The colors are vibrant and the quality is outstanding.",
      "A masterpiece that brings warmth and culture to my home. The artist's skill is evident in every detail."
    ]
  },
  {
    userName: "Rajesh Kumar",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    ratingRange: [4, 5],
    comments: [
      "A stunning example of traditional artistry. The quality is excellent and it arrived well-packaged.",
      "The intricate details and craftsmanship are remarkable. A true representation of our rich cultural heritage.",
      "Beautiful piece with amazing attention to detail. The artist has done justice to the traditional art form."
    ]
  },
  {
    userName: "Anita Desai",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    ratingRange: [3, 5],
    comments: [
      "This artwork exceeded my expectations! The colors are vibrant and it looks even better in person.",
      "Such a unique piece that tells a beautiful story. The artisan's expertise is clearly visible.",
      "Love how this piece combines traditional techniques with contemporary style. Very pleased with my purchase."
    ]
  },
  {
    userName: "Vikram Singh",
    userImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    ratingRange: [4, 5],
    comments: [
      "Beautiful craftsmanship and unique design. Really adds character to my home.",
      "The attention to minute details is impressive. A perfect blend of tradition and creativity.",
      "An exceptional piece that showcases the richness of Indian handicrafts. Well worth the investment."
    ]
  },
  {
    userName: "Meera Patel",
    userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    ratingRange: [4, 5],
    comments: [
      "A masterpiece! The artist's skill is evident in every detail. Shipping was quick and secure.",
      "The quality and authenticity of this piece is outstanding. Exactly what I was looking for.",
      "Gorgeous artwork that exceeded my expectations. The photos don't do it justice!"
    ]
  }
];

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAIfHAADkFetBGWuEfdniK3-xqzKCkyqrA",
  authDomain: "karigarsetu.firebaseapp.com",
  projectId: "karigarsetu",
  storageBucket: "karigarsetu.appspot.com",
  messagingSenderId: "518096117495",
  appId: "1:518096117495:web:a614379facd82ed4197df2",
  measurementId: "G-MB9M9HC65L"
};

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get random item from array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to get random number between min and max
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to get random date within last 3 months
const getRandomDate = () => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  return new Date(threeMonthsAgo.getTime() + Math.random() * (new Date().getTime() - threeMonthsAgo.getTime()));
};

async function initializeReviews() {
  try {
    // First, get all artworks
    const artworksRef = collection(db, "artworks");
    const artworksSnapshot = await getDocs(artworksRef);
    console.log(`Found ${artworksSnapshot.size} artworks`);

    // For each artwork
    for (const artworkDoc of artworksSnapshot.docs) {
      const artworkData = artworkDoc.data();
      console.log(`\nProcessing artwork: ${artworkData.name}`);

      // Generate 3-5 reviews for each artwork
      const numReviews = getRandomNumber(3, 5);
      
      for (let i = 0; i < numReviews; i++) {
        // Get random reviewer template
        const reviewTemplate = getRandomItem(reviewTemplates);
        
        // Create review
        const reviewData = {
          artworkId: artworkDoc.id,
          userName: reviewTemplate.userName,
          userImage: reviewTemplate.userImage,
          rating: getRandomNumber(reviewTemplate.ratingRange[0], reviewTemplate.ratingRange[1]),
          date: getRandomDate().toISOString(),
          comment: getRandomItem(reviewTemplate.comments),
          helpful: getRandomNumber(0, 15)
        };

        // Add review to Firestore
        await addDoc(collection(db, 'reviews'), reviewData);
        console.log(`Added review by ${reviewData.userName} for artwork ${artworkData.name}`);
      }
    }

    console.log('\n✅ All reviews have been added to Firestore');
  } catch (error) {
    console.error('Error adding reviews:', error);
  }
}

// Run the initialization
initializeReviews().then(() => process.exit(0));