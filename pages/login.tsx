import React from "react";
import { DiscordSVG, GoogleSVG } from "../components/Layouts/icons";

export default function login() {
	return (
		<>
			<h1 className="title">
				Schedule events between{" "}
				<span className="bg-gradient-to-r from-purpleGradientStart via-purpleGradientMid to-purpleGradientEnd text-transparent bg-clip-text">
					timezones
				</span>
			</h1>
			<div className="auth-container">
				<div className="auth-label">
					<span>AUTHENTICATED</span>
				</div>
				<p className="indications">
					Log in to create and join events from friends
				</p>
				<div className="flex">
					<LoginButton>
						<DiscordSVG className="h-5" />
						<span className="ml-4 ">DISCORD</span>
					</LoginButton>
					<LoginButton>
						<GoogleSVG className="h-5" />
						<span className="ml-4 ">GOOGLE</span>
					</LoginButton>
				</div>
			</div>
		</>
	);
}

function LoginButton({ children }: any) {
	return (
		<button className="py-4 px-8 flex items-center bg-gradient-to-t from-btnGradientBott to-btnGradientTop">
			{children}
		</button>
	);
}
