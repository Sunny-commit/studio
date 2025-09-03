
'use server';

import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @returns The web link to view the file.
 */
export async function uploadFile(file: File): Promise<string> {
  console.log(`[Firebase Storage Service] Uploading file: ${file.name}`);
  
  const storageRef = ref(storage, `question-papers/${Date.now()}-${file.name}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  console.log('[Firebase Storage Service] Upload complete.');

  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
