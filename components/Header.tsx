import React from "react";
import Image from "next/image";
import { Container } from "./Layouts";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";
import { capitalizeFirstLetter } from "../lib/utils/client-helpers";

type props = {
	username: string | null;
	photoURL: string | null;
	authProvider: string | null;
	screenName: string;
};

export default function Header({
	username,
	photoURL,
	authProvider,
	screenName,
}: props) {
	return (
        <div className="bg-gradient-to-t from-headerBottom to-headerTop flex items-end relative h-56 sm:h-60 shadow-md">
                <Container styles="relative flex items-end">
                    <LogoutButton />
                    <div className="flex items-center">
                        <div className="avatar w-avatar-sm-w sm:w-40 md:w-44 relative mb-4 mr-3 ">
                            <Image
                                src={photoURL || ""}
                                width="128"
                                height="128"
                                layout="responsive"
                                className="rounded-full"
                                priority
                                quality="100"
                            />
                        </div>
                        <div className="">
                            <p className="font-bold text-sm sm:text-base xl:text-lg">{screenName}</p>
                            <h1 className="text-4xl font-bold break-words max-w-[100%] sm:text-6xl xl:text-8xl">{capitalizeFirstLetter(username)}</h1>
                        </div>
                    </div>
                </Container>
        </div>
	);
}

function LogoutButton({}) {
	const logOut = async () => {
		try {
			const result = await signOut(auth);
			console.log("succesfully signed out!");	
		} catch (error) {
			console.error(error);
			toast.error("There was an error while login out", {
				duration: 4050,
			});
		}
	};
	return (
		<button
			className="logout-transition absolute top-5 right-0 bg-gradient-to-t from-logoutBtnBottomColor to-logoutBtnTopColor py-2 px-5 rounded-2xl text-sm font-bold"
			onClick={logOut}
		>
			Log Out
		</button>
	);
}
