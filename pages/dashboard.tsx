import React from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import ProtectedRoute from "../components/ProtectedRoute";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
export default function Dashboard() {
	const userData = useContext(UserContext);
	const logOut = async () => {
		try {
			const result = await signOut(auth);
			console.log("succesfully signed out!");
		} catch(error) {
			console.error(error);
		}

	}
	return (
		<div>
			<ProtectedRoute options={{ pathAfterFailure: "/login" }}>
					<h1>{userData?.user?.displayName}</h1>
					<img src={userData?.user?.photoURL} />
					<button onClick={logOut}>Sign Out</button>
			</ProtectedRoute>
		</div>
	);
}
