import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function subscribeEmail(email: string) {
  try {
    await addDoc(collection(db, "subscriptions"), {
      email,
      subscribedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe:", error);
    return { success: false, error };
  }
}
