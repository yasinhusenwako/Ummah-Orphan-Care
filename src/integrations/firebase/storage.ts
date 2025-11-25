import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot
} from "firebase/storage";
import { storage } from "./client";

export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

export const getFileURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};
