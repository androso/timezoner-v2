import React from "react";
import { DiscordSVG, GoogleSVG } from "../components/icons";

export default function login() {
	return (
		<div className="h-full flex flex-col items-center mx-auto w-[85%]">
			<h1 className="title mt-40 text-4xl text-center font-bold font-sans max-w-[370px]">
				Schedule events between{" "}
				<span className="bg-gradient-to-r from-purpleGradientStart via-purpleGradientMid to-purpleGradientEnd text-transparent bg-clip-text">
					timezones
				</span>
			</h1>
			<div className="auth-container mt-16 bg-containerGray py-16 w-full max-w-[430px] sm:w-[430px] px-16 rounded-lg relative text-center drop-shadow-2xl">

				<div className="auth-label absolute -top-5 left-1/2 -translate-x-1/2 px-4 bg-darkLabel py-2 rounded-md ">
					<p className="bg-gradient-to-r from-lightBlue to-lightGreen text-transparent bg-clip-text font-semibold tracking-tighter">AUTHENTICATED</p>
				</div>
				<p className="indications font-medium text-lg">
					Log in to create and join events from friends
				</p>
				<div className="flex flex-col items-center mt-8 mx-auto">
					<LoginButton>
						<span className="min-w-[35px] min-h-full flex items-center justify-center mr-2">
							<DiscordSVG className="h-5" />
						</span>
						<span className=" font-semibold">DISCORD</span>
					</LoginButton>
					<LoginButton>
						<span className="min-w-[35px] min-h-full flex items-center justify-center mr-2">
							<GoogleSVG className="h-5" />
						</span>
						<span className="font-semibold">GOOGLE</span>
					</LoginButton>	
				</div>
			</div>
		</div>
	);
}

function LoginButton({ children }: any) {
	return (
		<button className="w-[170px] sm:min-w-[182px] py-4 px-8 flex items-center bg-gradient-to-t from-btnGradientBott to-btnGradientTop rounded-md mb-2 last:mb-0 drop-shadow-md">
			{children}
		</button>
	);
}
