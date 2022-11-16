// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQeWOnAd02eL0sOduBNjJYHUjQ947ck08",
  authDomain: "resource-guide-fac3e.firebaseapp.com",
  projectId: "resource-guide-fac3e",
  storageBucket: "resource-guide-fac3e.appspot.com",
  messagingSenderId: "867020591067",
  appId: "1:867020591067:web:b05d244e1eba4036b3a1fe",
  measurementId: "G-9BCD2KMHKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);