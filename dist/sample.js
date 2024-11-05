"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
const firebaseConfig = {
    apiKey: "AIzaSyA855POoSBqN7a488cf2c2mSG1YO1rA4N8",
    authDomain: "gym-app-38e9b.firebaseapp.com",
    projectId: "gym-app-38e9b",
    storageBucket: "gym-app-38e9b.firebasestorage.app",
    messagingSenderId: "1091397119663",
    appId: "1:1091397119663:web:95222f5a95fedffbd92e5a",
    measurementId: "G-Z5RYH0P2Z0"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
const analytics = (0, analytics_1.getAnalytics)(app);
