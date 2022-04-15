import {
	initializeApp,
	getApp,
	getApps,
	FirebaseError,
	FirebaseAppSettings,
	FirebaseApp,
} from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyA-ZOPrYdDGK_AvrjS0Qe6j7VINSMGr2qc",
	authDomain: "timezoner-v2.firebaseapp.com",
	projectId: "timezoner-v2",
	storageBucket: "timezoner-v2.appspot.com",
	messagingSenderId: "18404425106",
	appId: "1:18404425106:web:6bf00dae40538ede7b154b",
	measurementId: "G-SVTB7T67BX",
};

function createFirebaseApp(config: object) {
	try {
		return getApp();
	} catch {
		return initializeApp(firebaseConfig);
	}
}

export const firebaseApp = createFirebaseApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const firestore = getFirestore(firebaseApp);
