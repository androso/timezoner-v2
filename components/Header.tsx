import React from "react";
import Image, { StaticImageData } from "next/image";
import Container from "./Layouts/Container";
import { capitalizeFirstLetter } from "../lib/utils/client-helpers";
import LogoutButton from "./LogoutButton";
import avatarPlaceholder from "../public/placeholder-avatar.webp";

type props = {
	title: string | undefined;
	photoURL: string | undefined | StaticImageData;
	screenName: string;
};

export default function Header({
	title = "...",
	photoURL = avatarPlaceholder,
	screenName,
}: props) {
	return (
		<div className="bg-gradient-to-t from-headerBottom to-headerTop flex items-end relative sm:h-60 shadow-md py-4">
			<Container css="relative flex items-end min-h-[224px]">
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
						<h1 className="text-4xl font-bold break-words max-w-[100%] sm:text-6xl xl:text-7xl">
							{capitalizeFirstLetter(title)}
						</h1>
					</div>
				</div>
			</Container>
		</div>
	);
}
