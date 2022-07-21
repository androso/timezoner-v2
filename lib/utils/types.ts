import { Credential } from "firebase-admin/app";
import { Control, UseFormRegister } from "react-hook-form";
import { DocumentReference, Timestamp } from "firebase/firestore";
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
	id: string;
};

export type dateRange = [Date | null, Date | null];

export type hourRange = {
	start_hour: Date | null;
	end_hour: Date | null;
};

export type EventFormValues = {
	title: string;
	description: string;
	timezone: string;
	dateRange: dateRange;
	startHour: Date;
	endHour: Date;
	hour_range: {
		start_hour: Date;
		end_hour: Date;
	};
};

export type baseFormFieldProps = {
	label: string;
	placeholder: string;
	required?: boolean;
};

export type inputProps = baseFormFieldProps & {
	name: "title" | "description";
	register: UseFormRegister<EventFormValues>;
};

export type HourPickerProps = baseFormFieldProps & {
	control: Control<EventFormValues, any>;
	name: "hour_range.start_hour" | "hour_range.end_hour";
};
type Participant = {
	user_ref: DocumentReference;
	dates_available: {
		date: Date;
		hours_selected: Date[];
	}[];
};

export type EventData = {
	date_range: {
		start_date: Date;
		end_date: Date;
	};
	hour_range: {
		start_hour: Date;
		end_hour: Date;
	};
	organizer_data: UserData;
	title: string;
	description: string;
	og_timezone: string;
	organizer_ref: DocumentReference;
	organizer_id: string;
	id: string;
	participants: Participant[];
};

type RawParticipant = {
	user_ref: DocumentReference;
	dates_available: {
		date: Timestamp;
		hours_selected: Timestamp[];
	};
};

export type RawEventDataFromFirestore = {
	date_range: {
		start_date: Timestamp;
		end_date: Timestamp;
	};
	hour_range: {
		start_hour: Timestamp;
		end_hour: Timestamp;
	};
	title: string;
	description: string;
	og_timezone: string;
	organizer_ref: DocumentReference;
	organizer_data: UserData;
	organizer_id: string;
	participants: RawParticipant[] | [2];
	id: string;
};
