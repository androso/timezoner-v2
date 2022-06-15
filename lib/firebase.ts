import { initializeApp, getApp } from "firebase/app";

import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
	apiKey: "AIzaSyA-ZOPrYdDGK_AvrjS0Qe6j7VINSMGr2qc",
	authDomain: "timezoner-v2.firebaseapp.com",
	projectId: "timezoner-v2",
	storageBucket: "timezoner-v2.appspot.com",
	messagingSenderId: "18404425106",
	appId: "1:18404425106:web:6bf00dae40538ede7b154b",
	measurementId: "G-SVTB7T67BX",
};

export function createFirebaseApp(config: object) {
	try {
		return getApp();
	} catch {
		return initializeApp(config);
	}
}

//! delete connect...Emulator when going to production, these are connecting to firebase emulators
export const firebaseApp = createFirebaseApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9099");
export const storage = getStorage(firebaseApp);
export const firestore = getFirestore(firebaseApp);
connectFirestoreEmulator(firestore, "localhost", 8080);
