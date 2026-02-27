import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase config (same jo Firebase console ne diya)
const firebaseConfig = {
  apiKey: "AIzaSyBmaQqVRntOqvuXpjGTohD-20TfIfd4n9E",
  authDomain: "trends-prompt.firebaseapp.com",
  projectId: "trends-prompt",
  storageBucket: "trends-prompt.firebasestorage.app",
  messagingSenderId: "121514591066",
  appId: "1:121514591066:web:a49e160a0aea9598afe963",
  measurementId: "G-P3220G6NF8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
  console.log("✅ Firebase Analytics initialized");
}

export { analytics };