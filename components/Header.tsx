import React from "react";
import Image, { StaticImageData } from "next/image";
import { Container } from "./Layouts";
import { capitalizeFirstLetter } from "../lib/utils/client-helpers";
import LogoutButton from "./LogoutButton";
import avatarPlaceholder from "../public/placeholder-avatar.webp";

type props = {
	username: string | undefined;
	photoURL: string | undefined | StaticImageData;
	screenName: string;
};


export default function Header({
	username = "...",
	photoURL = avatarPlaceholder,
	screenName,
}: props) {
	return (
		<div className="bg-gradient-to-t from-headerBottom to-headerTop flex items-end relative h-56 sm:h-60 shadow-md">
			<Container className="relative flex items-end">
				<LogoutButton />
				<div className="flex items-center">
					<div className="avatar w-avatar-sm-w sm:w-40 md:w-44 relative mb-4 mr-3 ">
						<Image
							src={photoURL}
							width="128"
							height="128"
							layout="responsive"
							className="rounded-full"
							priority
							quality="100"
						/>
					</div>
					<div>
						<p className="font-bold text-sm sm:text-base xl:text-lg">
							{screenName}
						</p>
						<h1 className="text-4xl font-bold break-words max-w-[100%] sm:text-6xl xl:text-8xl">
							{capitalizeFirstLetter(username)}
						</h1>
					</div>
				</div>
			</Container>
		</div>
	);
}
