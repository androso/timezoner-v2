import { auth, firestore } from "./firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc

export const useUserData = () => {
	const [user] = useAuthState(auth);
	return { user };
};
