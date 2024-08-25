import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-app-61ec9.firebaseapp.com",
  projectId: "react-app-61ec9",
  storageBucket: "react-app-61ec9.appspot.com",
  messagingSenderId: "310807367091",
  appId: "1:310807367091:web:9a6fbd03e44ef07a988fc6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

