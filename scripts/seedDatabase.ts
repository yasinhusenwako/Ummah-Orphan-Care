import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { SAMPLE_CATEGORIES, SAMPLE_ORPHANS } from '../src/integrations/firebase/collections';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Seed categories
    console.log('Creating categories...');
    const categoryIds: { [key: string]: string } = {};
    
    for (const category of SAMPLE_CATEGORIES) {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: new Date().toISOString()
      });
      categoryIds[category.name.toLowerCase()] = docRef.id;
      console.log(`Created category: ${category.name}`);
    }

    // Seed orphans
    console.log('Creating orphans...');
    for (const orphan of SAMPLE_ORPHANS) {
      await addDoc(collection(db, 'orphans'), {
        ...orphan,
        categoryId: categoryIds['education'] || 'education',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`Created orphan: ${orphan.name}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
