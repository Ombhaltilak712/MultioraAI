// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rivaai-65900.firebaseapp.com",
  projectId: "rivaai-65900",
  storageBucket: "rivaai-65900.firebasestorage.app",
  messagingSenderId: "999577996492",
  appId: "1:999577996492:web:99b7e01ec50550a6d10669"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account"
})