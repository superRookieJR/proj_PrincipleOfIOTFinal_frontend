import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBrlfXycXXzSRv2XkUmF0aIl7-YUFwvgkA",
    authDomain: "principleofiotfinal-database.firebaseapp.com",
    projectId: "principleofiotfinal-database",
    storageBucket: "principleofiotfinal-database.firebasestorage.app",
    messagingSenderId: "167345532475",
    appId: "1:167345532475:web:d536e8586b31f584eab61e",
    measurementId: "G-D82VXV0BXM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };