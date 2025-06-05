// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAdpFQuMTI_qwz-RaCax_Fqz8JxSSOJ4Xg",
  authDomain: "prueba-vuejs-d9fb1.firebaseapp.com",
  projectId: "prueba-vuejs-d9fb1",
  storageBucket: "prueba-vuejs-d9fb1.firebasestorage.app",
  messagingSenderId: "662155655381",
  appId: "1:662155655381:web:502f266d6ee469ed6e0a5c",
  measurementId: "G-B2C31VL72Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);