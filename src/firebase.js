import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD0R6yrtY_2fhK7qEghPJz7ubp8EB78dV8",
  authDomain: "fir-app-1-3a5d3.firebaseapp.com",
  projectId: "fir-app-1-3a5d3",
  storageBucket: "fir-app-1-3a5d3.firebasestorage.app",
  messagingSenderId: "634732495099",
  appId: "1:634732495099:web:ed3d5c3c90e0ad8f5cf05e",
  databaseURL: "https://fir-app-1-3a5d3-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
