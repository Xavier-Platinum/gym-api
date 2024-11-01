// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA855POoSBqN7a488cf2c2mSG1YO1rA4N8",
  authDomain: "gym-app-38e9b.firebaseapp.com",
  projectId: "gym-app-38e9b",
  storageBucket: "gym-app-38e9b.firebasestorage.app",
  messagingSenderId: "1091397119663",
  appId: "1:1091397119663:web:95222f5a95fedffbd92e5a",
  measurementId: "G-Z5RYH0P2Z0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);