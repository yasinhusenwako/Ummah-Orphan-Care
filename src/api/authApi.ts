import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/client';

interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Helper to create/update user document in Firestore
const createUserDocument = async (user: User, displayName: string, role: 'donor' | 'admin') => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || 'User',
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
};

// Email/Password Registration
const register = async (
  email: string,
  password: string,
  displayName: string,
  role: 'donor' | 'admin' = 'donor'
): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(userCredential.user, displayName, role);
    return { success: true, data: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Email/Password Login
const login = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, data: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Google Sign-In
const loginWithGoogle = async (role: 'donor' | 'admin' = 'donor'): Promise<AuthResult> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await createUserDocument(userCredential.user, userCredential.user.displayName || 'User', role);
    return { success: true, data: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Phone: Send Verification Code
const sendPhoneCode = async (
  phoneNumber: string,
  recaptchaContainerId: string
): Promise<AuthResult> => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved
      }
    });

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { success: true, data: confirmationResult };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Phone: Verify Code
const verifyPhoneCode = async (
  confirmationResult: ConfirmationResult,
  code: string,
  displayName: string,
  role: 'donor' | 'admin' = 'donor'
): Promise<AuthResult> => {
  try {
    const userCredential = await confirmationResult.confirm(code);
    await createUserDocument(userCredential.user, displayName, role);
    return { success: true, data: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Logout
const logout = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const authApi = {
  register,
  login,
  loginWithGoogle,
  sendPhoneCode,
  verifyPhoneCode,
  logout
};
