// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAzxhawqxkxFEzPhQE0D-kjTTaETPJ-Qys",
    authDomain: "theonly-basketball-dev.firebaseapp.com",
    projectId: "theonly-basketball-dev",
    storageBucket: "theonly-basketball-dev.appspot.com",
    messagingSenderId: "192983955845",
    appId: "1:192983955845:web:a5d9e03ebb23247930ecec",
    measurementId: "G-CRCJ0NWBCQ"
  };

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 초기화
const db = getFirestore(app);

export { db };
