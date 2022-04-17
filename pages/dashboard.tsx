import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
// import AuthenticatedRoute from "../components/AuthenticatedRoute";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/LoadingSpinner";


export default function Dashboard() {
	const userData = useContext(UserContext);

	return (
		<div>
			<AuthenticatedRoute options={{pathAfterFailure: '/login'}}>
					<>
						<h1>{userData?.user?.displayName}</h1>
						<img src={userData?.user?.photoURL} />
					</>
			</AuthenticatedRoute>
		</div> 
	)
}

type props = {
	children: any;
	options: {
		pathAfterFailure: string
	};
};


function AuthenticatedRoute({ children, options = {pathAfterFailure: '/login'} }: props) {
	const {user, isLoggedIn, loading} = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (isLoggedIn) {
			console.log('this should only happen when a user is logged in')
			setIsLoading(false);
		} else if (isLoggedIn === false && loading === false) { 
			router.push(options.pathAfterFailure)
		}
	}, [user, isLoggedIn, loading]);

	return (
		isLoading ? <LoadingSpinner/>
		:
		children
	);
}
