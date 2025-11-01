const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Detailed descriptions for different artwork categories
const descriptions = {
  "Tanjore Painting": {
    description: "This exquisite Tanjore painting showcases the traditional South Indian art form with its characteristic use of gold foil, vibrant colors, and glass beads. The painting depicts a divine scene with intricate details and embellishments. Created using time-honored techniques, it features a raised and decorated surface with semi-precious stones, giving it a three-dimensional effect. The gold foil work catches light beautifully, making it a stunning centerpiece for any space.",
    material: "Gold foil, semi-precious stones, traditional pigments on wooden board",
    dimensions: "24 x 36 inches",
    specifications: "Handcrafted with 22k gold foil embellishments"
  },
  "Blue Pottery Decorative Bowl": {
    description: "This handcrafted Blue Pottery bowl exemplifies the finest traditions of Jaipur's ceramic art. Made from quartz powder instead of clay, it features the characteristic Persian blue glaze with intricate floral and geometric patterns. Each piece is meticulously hand-painted using natural colors, making it not just a functional bowl but a piece of art that tells the story of a centuries-old craft.",
    material: "Quartz powder, natural colors, Persian blue glaze",
    dimensions: "Diameter: 12 inches, Height: 4 inches",
    specifications: "Food safe, hand-wash recommended"
  },
  "Bandhani Silk Saree": {
    description: "This elegant Bandhani silk saree showcases the intricate tie-dye art of Gujarat. Each tiny dot is carefully tied and dyed by hand, creating mesmerizing patterns that speak of the artisan's skill and patience. The pure silk fabric provides a luxurious drape, while the traditional bandhani patterns combine with contemporary color combinations to create a timeless piece.",
    material: "Pure silk with natural dyes",
    dimensions: "5.5 meters length, with 0.8-meter blouse piece",
    specifications: "Includes unstitched blouse piece, dry clean only"
  },
  "Hand-Painted Madhubani Art": {
    description: "This vibrant Madhubani painting is a celebration of Bihar's rich artistic heritage. Created using natural dyes and pigments, it depicts scenes from rural life and mythology with characteristic geometric patterns and bright colors. Every inch of the canvas is filled with intricate details, showcasing the artist's masterful control over this ancient art form.",
    material: "Natural pigments and dyes on handmade paper",
    dimensions: "30 x 40 inches",
    specifications: "Double-mounted for preservation"
  },
  "Warli Wall Art": {
    description: "This contemporary Warli painting maintains the traditional simplicity of tribal art while telling modern stories. Using the characteristic white paint on earthen background, it depicts the harmony between humans and nature. The stick figures and geometric shapes create a dynamic composition that brings ancient storytelling traditions into modern spaces.",
    material: "Natural white pigment on handmade paper",
    dimensions: "20 x 30 inches",
    specifications: "UV-protected coating for longevity"
  },
  "Brass Dhokra Art": {
    description: "This Dhokra figurine exemplifies the ancient lost-wax casting technique of metal crafting. Each piece is unique, featuring intricate geometric patterns and tribal motifs that have been passed down through generations. The rich patina of the brass adds character to this authentic piece of tribal art.",
    material: "Recycled brass using lost-wax casting",
    dimensions: "Height: 12 inches, Width: 6 inches",
    specifications: "Handcrafted by tribal artisans"
  },
  "Kantha Embroidered Scarf": {
    description: "This exquisite Kantha embroidered scarf showcases the delicate needlework tradition of Bengal. Layer upon layer of tiny running stitches create intricate patterns and textures, transforming simple fabric into wearable art. Made from soft cotton, this scarf combines traditional craftsmanship with contemporary design.",
    material: "Pure cotton with silk thread embroidery",
    dimensions: "72 x 20 inches",
    specifications: "Hand-wash recommended"
  },
  "Kathakali Mask Collection": {
    description: "This authentic Kathakali mask captures the dramatic essence of Kerala's classical dance-drama. Hand-carved and painted with natural colors, it showcases the exaggerated features and expressions characteristic of Kathakali performance art. Each mask is a unique piece of cultural heritage, perfect for display or theatrical use.",
    material: "Wood with natural pigments",
    dimensions: "16 x 12 inches",
    specifications: "Wall-mountable, includes display stand"
  },
  "Pattachitra Palm Leaf Art": {
    description: "This intricate Pattachitra artwork is created on specially treated palm leaves, continuing an ancient Odisha tradition. The detailed illustrations depict mythological scenes with delicate lines and natural colors. Each piece requires meticulous attention to detail and weeks of careful craftsmanship.",
    material: "Treated palm leaves with natural dyes",
    dimensions: "15 x 10 inches",
    specifications: "Includes protective display case"
  },
  "Chikankari Kurti": {
    description: "This elegant Chikankari kurti showcases Lucknow's finest hand embroidery. The delicate white-on-white threadwork creates subtle textures and patterns that epitomize understated luxury. Each piece features traditional motifs executed with precision, creating an ethereal effect on premium cotton fabric.",
    material: "Pure cotton with cotton thread embroidery",
    dimensions: "Available in S, M, L sizes",
    specifications: "Hand wash in cold water"
  },
  "Banarasi Silk Saree": {
    description: "This opulent Banarasi silk saree represents the pinnacle of Indian weaving traditions. Featuring intricate zari work in pure gold thread, it showcases classic motifs woven against rich silk. The meticulous attention to detail and use of premium materials makes each saree a cherished heirloom.",
    material: "Pure silk with gold zari work",
    dimensions: "5.5 meters with 0.8-meter blouse piece",
    specifications: "Includes authenticity certificate"
  },
  "Phulkari Dupatta": {
    description: "This vibrant Phulkari dupatta showcases Punjab's rich embroidery tradition. Created using silk floss on cotton base, it features geometric patterns that cover the entire fabric in a dazzling display of color and skill. Each piece requires weeks of meticulous handwork to complete.",
    material: "Cotton base with silk thread embroidery",
    dimensions: "2.5 meters length",
    specifications: "Dry clean recommended"
  }
};

async function updateArtworkDescriptions() {
  try {
    // Get all artworks
    const artworksRef = collection(db, "artworks");
    const artworksSnapshot = await getDocs(artworksRef);
    console.log(`Found ${artworksSnapshot.size} artworks`);

    // Update each artwork
    for (const artworkDoc of artworksSnapshot.docs) {
      const artworkData = artworkDoc.data();
      const artworkName = artworkData.name;
      console.log(`\nProcessing artwork: ${artworkName}`);

      if (descriptions[artworkName]) {
        // Update the artwork document with new description and details
        const artworkRef = doc(db, "artworks", artworkDoc.id);
        await updateDoc(artworkRef, {
          description: descriptions[artworkName].description,
          material: descriptions[artworkName].material,
          dimensions: descriptions[artworkName].dimensions,
          specifications: descriptions[artworkName].specifications
        });
        console.log(`✅ Updated description for: ${artworkName}`);
      } else {
        // Generate a generic description if specific one not found
        const category = artworkData.category || "traditional art";
        const state = artworkData.state || "India";
        const genericDescription = `This beautiful piece of ${category} from ${state} showcases the rich cultural heritage of Indian craftsmanship. Created by skilled artisans using traditional techniques, it combines age-old artistry with contemporary appeal. Each piece is unique and handcrafted with attention to detail, making it a valuable addition to any collection.`;
        
        const artworkRef = doc(db, "artworks", artworkDoc.id);
        await updateDoc(artworkRef, {
          description: genericDescription,
          material: "Traditional materials",
          dimensions: "Please contact seller for exact dimensions",
          specifications: "Handcrafted with care"
        });
        console.log(`ℹ️ Added generic description for: ${artworkName}`);
      }
    }

    console.log('\n✅ All artwork descriptions have been updated');
  } catch (error) {
    console.error('Error updating descriptions:', error);
  }
}

// Run the update
updateArtworkDescriptions().then(() => process.exit(0));