import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  "projectId": "studio-7321343101-71473",
  "appId": "1:76192005268:web:944031a7edaee73192c881",
  "apiKey": "AIzaSyCo2LU5HhfIDR9dzMqdYQlyXjuskZB2v6U",
  "authDomain": "studio-7321343101-71473.firebaseapp.com",
  "measurementId": "G-7W5G42QLF3",
  "messagingSenderId": "76192005268",
  "storageBucket": "studio-7321343101-71473.appspot.com"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };
