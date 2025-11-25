import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file manually
const envPath = resolve(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim();
      // Remove surrounding quotes
      value = value.replace(/^["']|["']$/g, '');
      envVars[key.trim()] = value;
    }
  }
});

console.log('Firebase Config loaded:');
console.log('API Key:', envVars.VITE_FIREBASE_API_KEY?.substring(0, 10) + '...');
console.log('Project ID:', envVars.VITE_FIREBASE_PROJECT_ID);
console.log('');

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const mockAccounts = [
  {
    email: 'admin@ummah.test',
    password: 'Admin123!',
    displayName: 'Admin User',
    role: 'admin' as const
  },
  {
    email: 'donor@ummah.test',
    password: 'Donor123!',
    displayName: 'John Donor',
    role: 'donor' as const
  },
  {
    email: 'donor2@ummah.test',
    password: 'Donor123!',
    displayName: 'Sarah Donor',
    role: 'donor' as const
  }
];

async function createMockAccounts() {
  console.log('Creating mock accounts...\n');

  for (const account of mockAccounts) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        account.email,
        account.password
      );
      
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, {
        displayName: account.displayName
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: account.email,
        displayName: account.displayName,
        role: account.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ Created ${account.role}: ${account.email}`);
      console.log(`   Name: ${account.displayName}`);
      console.log(`   UID: ${user.uid}\n`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Account already exists: ${account.email}\n`);
      } else {
        console.error(`❌ Error creating ${account.email}:`, error.message, '\n');
      }
    }
  }

  console.log('Mock account creation complete!');
  console.log('\nYou can now login with these credentials:');
  console.log('See MOCK_ACCOUNTS.md for details\n');
  
  process.exit(0);
}

createMockAccounts().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
