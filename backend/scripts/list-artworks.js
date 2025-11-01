const admin = require('firebase-admin');
const path = require('path');

// Initialize admin with service account
const fs = require('fs');
const saPath = process.env.FIREBASE_ADMIN_SA_PATH || path.resolve(__dirname, '../config/serviceAccountKey.json');
let serviceAccount;
try {
  if (fs.existsSync(saPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (err) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'));
    }
  } else {
    console.error('Could not load service account from', saPath, 'and FIREBASE_SERVICE_ACCOUNT_KEY is not set');
    process.exit(1);
  }
} catch (e) {
  console.error('Could not parse service account JSON from', saPath, e.message || e);
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || 'karigarsetu'
  });
} catch (e) {
  // already initialized in server maybe
}

async function list() {
  try {
    const snap = await admin.firestore().collection('artworks').get();
    console.log(`Found ${snap.size} artworks`);
    for (const doc of snap.docs) {
      const data = doc.data();
      console.log('id:', doc.id, 'name:', data.name || data.title || '(no name)');
    }
  } catch (err) {
    console.error('Error listing artworks:', err.message || err);
  }
}

list();
