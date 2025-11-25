import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData
} from "firebase/firestore";
import { db } from "./client";

export const createDocument = async (collectionName: string, data: DocumentData) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const getDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// Export query helpers for convenience
export { where, orderBy, limit };
