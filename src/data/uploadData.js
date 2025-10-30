import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import admin from "firebase-admin";

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Define all file paths clearly
const paths = {
  serviceAccount: path.resolve(__dirname, "../../serviceAccountKey.json"),
  artworks: path.resolve(__dirname, "./artworks.json"),
  workshops: path.resolve(__dirname, "./workshops.json"),
  exhibitions: path.resolve(__dirname, "./exhibitions.json"),
  artworksDashboard: path.resolve(__dirname, "./artworks_dashboard.json"),
  reviews: path.resolve(__dirname, "./reviews.json"),
};

// ✅ Helper to safely load JSON
const loadJSON = (filePath, name) => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${name} file not found at ${filePath}`);
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) {
    console.error(`❌ ${name} file is empty.`);
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    // handle object-based JSON (e.g., {1: {...}, 2: {...}})
    return Array.isArray(parsed) ? parsed : Object.values(parsed);
  } catch (err) {
    console.error(`❌ Failed to parse ${name}:`, err.message);
    return [];
  }
};

// ✅ Load data
const serviceAccount = JSON.parse(fs.readFileSync(paths.serviceAccount, "utf8"));
const artworks = loadJSON(paths.artworks, "Artworks");
const workshops = loadJSON(paths.workshops, "Workshops");
const exhibitions = loadJSON(paths.exhibitions, "Exhibitions");
const artworksDashboard = loadJSON(paths.artworksDashboard, "Artworks Dashboard");
const reviews = loadJSON(paths.reviews, "Reviews");

// ✅ Log data counts
console.log("📦 Data loaded:");
console.log(`   Artworks: ${artworks.length}`);
console.log(`   Workshops: ${workshops.length}`);
console.log(`   Exhibitions: ${exhibitions.length}`);
console.log(`   Artworks Dashboard: ${artworksDashboard.length}`);
console.log(`   Reviews: ${reviews.length}`);

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✅ Upload helper
const uploadCollection = async (collectionName, data) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`⚠️ Skipping '${collectionName}' (no data found).`);
    return;
  }

  console.log(`\n🚀 Uploading ${data.length} items to '${collectionName}'...`);
  const collectionRef = db.collection(collectionName);

  for (const item of data) {
    await collectionRef.add(item);
  }

  console.log(`✅ Successfully uploaded '${collectionName}'`);
};

// ✅ Run uploads
(async () => {
  try {
    await uploadCollection("artworks", artworks);
    await uploadCollection("workshops", workshops);
    await uploadCollection("exhibitions", exhibitions);
    await uploadCollection("artworks_dashboard", artworksDashboard);
    await uploadCollection("reviews", reviews);

    console.log("\n🎉 All data uploaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error uploading data:", error);
    process.exit(1);
  }
})();
