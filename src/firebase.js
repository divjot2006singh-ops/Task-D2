import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBdkiTD4lnPvUn0lEc2U2MqQGvFfDIoBcw",
  authDomain: "devatdeakin-ec73a.firebaseapp.com",
  projectId: "devatdeakin-ec73a",
  storageBucket: "devatdeakin-ec73a.firebasestorage.app",
  messagingSenderId: "713787873202",
  appId: "1:713787873202:web:039526be788e7f778676ab"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };