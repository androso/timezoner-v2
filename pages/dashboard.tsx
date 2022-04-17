import React from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
	const userData = useContext(UserContext);

	return (
		<div>
			<ProtectedRoute options={{ pathAfterFailure: "/login" }}>
					<h1>{userData?.user?.displayName}</h1>
					<img src={userData?.user?.photoURL} />
			</ProtectedRoute>
		</div>
	);
}
