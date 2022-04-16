import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function dashboard() {
	const userData = useContext(UserContext);
  const [user, setUser] = useState(null);

	useEffect(() => {
		if (userData.user != null) {
      setUser(userData.user);
      console.log(userData.user);
    }
	}, [userData]);

	return (
		<div>
			{user != null ? (
				<>
					<h1>{user.displayName}</h1>
          <img src={user.photoURL}/>
				</>
			) : (
				<p>Loading</p>
			)}
		</div>
	);
}
