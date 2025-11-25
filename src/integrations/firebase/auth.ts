import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  linkWithCredential
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./client";
import { COLLECTIONS } from "./collections";
import { User, UserRole } from "@/types";

// ============================================
// Email/Password Authentication
// ============================================

export const signUp = async (
  email: string, 
  password: string, 
  displayName: string,
  role: UserRole = 'donor'
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  if (user) {
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData);
  }
  
  return user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logOut = async () => {
  await signOut(auth);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// ============================================
// Google Authentication
// ============================================

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async (role: UserRole = 'donor') => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    
    if (!userDoc.exists()) {
      // Create user document for new Google users
      const userData: Omit<User, 'id'> = {
        email: user.email || '',
        displayName: user.displayName || 'Google User',
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData);
    }
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      // Fallback to redirect if popup is blocked
      return signInWithGoogleRedirect();
    }
    throw error;
  }
};

export const signInWithGoogleRedirect = async () => {
  await signInWithRedirect(auth, googleProvider);
};

export const handleGoogleRedirectResult = async (role: UserRole = 'donor') => {
  const result = await getRedirectResult(auth);
  
  if (result) {
    const user = result.user;
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    
    if (!userDoc.exists()) {
      const userData: Omit<User, 'id'> = {
        email: user.email || '',
        displayName: user.displayName || 'Google User',
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData);
    }
    
    return user;
  }
  
  return null;
};

// ============================================
// Phone Number Authentication
// ============================================

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initializeRecaptcha = (containerId: string) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        // Response expired
        recaptchaVerifier = null;
      }
    });
  }
  return recaptchaVerifier;
};

export const sendPhoneVerificationCode = async (
  phoneNumber: string,
  recaptchaContainerId: string
): Promise<ConfirmationResult> => {
  const verifier = initializeRecaptcha(recaptchaContainerId);
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  return confirmationResult;
};

export const verifyPhoneCode = async (
  confirmationResult: ConfirmationResult,
  code: string,
  displayName: string,
  role: UserRole = 'donor'
) => {
  const result = await confirmationResult.confirm(code);
  const user = result.user;
  
  // Check if user document exists
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
  
  if (!userDoc.exists()) {
    // Create user document for new phone users
    const userData: Omit<User, 'id'> = {
      email: user.email || '',
      displayName: displayName || user.phoneNumber || 'Phone User',
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData);
  }
  
  return user;
};

export const linkPhoneNumber = async (
  phoneNumber: string,
  verificationCode: string
) => {
  const credential = PhoneAuthProvider.credential(phoneNumber, verificationCode);
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('No user is currently signed in');
  }
  
  await linkWithCredential(user, credential);
  return user;
};

// ============================================
// Common Functions
// ============================================

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const getUserData = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
  return null;
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const updateUserProfile = async (displayName: string, photoURL?: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is currently signed in');
  
  await updateProfile(user, { displayName, photoURL });
  
  // Update Firestore document
  await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
    displayName,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};
