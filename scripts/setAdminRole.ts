import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
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
      value = value.replace(/^["']|["']$/g, '');
      envVars[key.trim()] = value;
    }
  }
});

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

async function setAdminRole() {
  console.log('Setting admin role for admin@ummah.test...\n');

  try {
    // Sign in as admin user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'admin@ummah.test',
      'Admin123!'
    );
    
    const user = userCredential.user;
    console.log('✅ Signed in as:', user.email);
    console.log('   UID:', user.uid);

    // Get current user document
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      console.log('\n📄 Current user data:');
      console.log('   Role:', currentData.role);
      console.log('   Email:', currentData.email);
      console.log('   Name:', currentData.displayName);

      // Update role to admin
      await updateDoc(userDocRef, {
        role: 'admin',
        updatedAt: new Date().toISOString()
      });

      console.log('\n✅ Successfully updated role to "admin"!');
      console.log('\n🎉 You can now login and access the Admin Panel!');
      console.log('   Email: admin@ummah.test');
      console.log('   Password: Admin123!');
      console.log('   Admin Panel: http://localhost:8081/admin\n');
    } else {
      console.error('❌ User document not found in Firestore');
      console.log('   Creating user document...');
      
      // Create user document if it doesn't exist
      await updateDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ User document created with admin role!');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n⚠️  User not found. Please create the account first:');
      console.log('   1. Go to http://localhost:8081/login');
      console.log('   2. Click "Sign up"');
      console.log('   3. Create account with email: admin@ummah.test');
      console.log('   4. Run this script again\n');
    } else if (error.code === 'auth/wrong-password') {
      console.log('\n⚠️  Wrong password. The password should be: Admin123!\n');
    }
  }

  process.exit(0);
}

setAdminRole().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
