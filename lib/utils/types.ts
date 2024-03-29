import { Credential } from "firebase-admin/app";
import { Control, UseFormRegister } from "react-hook-form";
import { DocumentReference } from "firebase/firestore";
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

export type hoursRange = {
	start_hour: Date | null;
	end_hour: Date | null;
};

export type EventFormValues = {
	title: string;
	description: string;
	timezone: string;
	date: Date;
	hours_range: {
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
	name: "hours_range.start_hour" | "hours_range.end_hour";
};

type Participant = {
	user_ref: DocumentReference;
	dates_available: {
		date: string;
		hours_selected: {
			hour: Date;
			tableElementIndex: number;
		}[];
	}[];
};
export type Schedule = {
	date: Date;
	hours_range: {
		hour: Date;
		tableElementIndex: number | null;
		participants: DocumentReference[];
	}[];
};
export type EventData = {
	date_range: Date[];
	hours_range: Date[];
	organizer_data: UserData;
	title: string;
	description: string;
	og_timezone: string;
	organizer_ref: DocumentReference;
	organizer_id: string;
	id: string;
	participants: DocumentReference[] | [];
	participants_schedules: Schedule[];
};

//TODO: DELETE
export type RawParticipant = {
	user_ref: DocumentReference;
	dates_available: {
		date: string;
		hours_selected: {
			hour: string;
			tableElementIndex: number;
		}[];
	}[];
};

type RawSchedule = {
	date: string;
	hours_range: {
		hour: string;
		tableElementIndex: number | null;
		participants: DocumentReference[];
	}[];
};

export type RawEventDataFromFirestore = {
	date_range: string[];
	hours_range: string[];
	title: string;
	description: string;
	og_timezone: string;
	organizer_ref: DocumentReference;
	organizer_id: string;
	participants: DocumentReference[] | [];
	participants_schedules: RawSchedule[];
	id: string;
};
