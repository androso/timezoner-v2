import { Credential } from "firebase-admin/app";
import { Control, UseFormRegister } from "react-hook-form";

export type adminAppConfig = {
	credential: Credential;
};

export enum DISCORD_API_ENDPOINTS {
	API_ENDPOINT = "https://discord.com/api/v8",
	CDN = "https://cdn.discordapp.com",
	USER = "https://discord.com/api/v8/users/@me",
	OAUTH2_TOKEN = "https://discord.com/api/v8/oauth2/token",
}

export type ExchangeCodeRequestParamsDiscord = {
	client_id: string;
	client_secret: string;
	grant_type: string;
	code: string;
	redirect_uri: string;
};

export type DiscordAuthCredentials = {
	access_token: string;
	refresh_token: string;
	firebase_token: string;
	provider: string;
};

export type UserData = {
	username: string;
	email: string;
	provider: string;
	avatar_url: string;
};

export type dateRange = [Date | null, Date | null];

export type EventFormValues = {
	eventTitle: string;
	description: string;
	timezone: string;
	date: [Date, Date] | null;
	dateRange: dateRange;
	// hourRange: [Date, Date];
	startHour: Date;
	endHour: Date;
	independent: dateRange;
};

export type baseFormFieldProps = {
	label: string;
	placeholder: string;
	required?: boolean;
}

export type inputProps = baseFormFieldProps & {
	name: "eventTitle" | "description";
	register: UseFormRegister<EventFormValues>;
};

export type HourPickerProps = baseFormFieldProps & {
	hourSelected: Date | null;
	updateFunc: (date: unknown) => void;
	control: Control<EventFormValues, any>;
	name: "startHour" | "endHour";
};
