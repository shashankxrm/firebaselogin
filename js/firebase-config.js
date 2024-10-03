import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
 
 // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAS6NLkW0HXW8qmvAjGZqqNGNdo7ZyZF1Y",
    authDomain: "fir-login-4437d.firebaseapp.com",
    projectId: "fir-login-4437d",
    storageBucket: "fir-login-4437d.appspot.com",
    messagingSenderId: "339644163389",
    appId: "1:339644163389:web:543c9438660eb5c5559154"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, onAuthStateChanged, signOut, getDoc, doc };