// Main Firebase exports
export { app, analytics, auth, db, storage } from "./client";

// Auth exports
export {
  // Email/Password
  signUp,
  signIn,
  logOut,
  resetPassword,
  // Google
  signInWithGoogle,
  signInWithGoogleRedirect,
  handleGoogleRedirectResult,
  // Phone
  initializeRecaptcha,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  linkPhoneNumber,
  // Common
  getCurrentUser,
  getUserData,
  onAuthChange,
  updateUserProfile
} from "./auth";

// Firestore exports
export {
  createDocument,
  getDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  where,
  orderBy,
  limit
} from "./firestore";

// Storage exports
export {
  uploadFile,
  deleteFile,
  getFileURL
} from "./storage";

// Collections
export { COLLECTIONS, SAMPLE_CATEGORIES, SAMPLE_ORPHANS } from "./collections";
