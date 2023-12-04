// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPoYBKLcrZCviJDwrKAg-o-O4M-M9JDxw",
  authDomain: "padel-27c21.firebaseapp.com",
  projectId: "padel-27c21",
  storageBucket: "padel-27c21.appspot.com",
  messagingSenderId: "84285530355",
  appId: "1:84285530355:web:2bb1964adfd742b3ce5786",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, auth, db };
