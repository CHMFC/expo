import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCTUT02faIthTCD9CcD0WRy6llqf0uu3A",
  authDomain: "fidelize-pe-1.firebaseapp.com",
  projectId: "fidelize-pe-1",
  storageBucket: "fidelize-pe-1.appspot.com",
  messagingSenderId: "398611291998",
  appId: "1:698611291998:web:dd8aff729c97848850e1cf",
  measurementId: "G-ZEGEVT9HF0"
};

const app = initializeApp(firebaseConfig);

export { app };
