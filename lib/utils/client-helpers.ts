import { User } from "firebase/auth";
import {
	doc,
	DocumentData,
	DocumentReference,
	getDoc,
	QueryDocumentSnapshot,
	QuerySnapshot,
	setDoc,
} from "firebase/firestore";
import gradstop from "gradstop";
import { firestore } from "../firebase";
import { timeZones } from "../timezonesData";
import { RawEventDataFromFirestore, UserData } from "./types";

const defaultGoogleAvatarSize = 96;

export const isValidUser = (
	user: User | null | undefined,
	isLoggedIn: boolean
) => {
	if (
		user != null &&
		user.displayName &&
		user.email &&
		user.photoURL &&
		isLoggedIn
	) {
		return true;
	} else {
		return false;
	}
};

// export const getDiscordUser = async (accessToken: string) => {
// 	return axios.get(DISCORD_API_ENDPOINTS.USER, {
// 		headers: {
// 			Authorization: `Bearer ${accessToken}`,
// 		},
// 	});
// };

export const capitalizeFirstLetter = (string: string | null) => {
	if (typeof string === "string") {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	return "";
};

export const sendUserToFirestore = async (user: User, provider: string) => {
	if (provider === "google.com") {
		const userId = user.uid;
		const userDocRef = doc(firestore, "users", userId);
		const userDocSnap = await getDoc(userDocRef);
		if (userDocSnap.exists()) {
			// console.log("we're not writing to database in this case");
			return;
		} else {
			// console.log("we're writing to database");
			return await setDoc(doc(firestore, "users", userId), {
				username: user.displayName,
				email: user.email,
				avatar_url: getHighQualityAvatar(user.photoURL || "3", "google.com"),
				provider,
				id: userId,
			});
		}
	}
};

export const getParsedDataFromUser = (
	user: User | null | undefined
): UserData | null => {
	if (user) {
		const username = user.displayName?.split(" ")[0] || "";
		const provider = user?.providerData[0]?.providerId || "discord";

		let avatar_url = "";
		if (provider === "discord") {
			avatar_url = user.photoURL || "";
		} else {
			//google
			// get a bigger image
			avatar_url = getHighQualityAvatar(user.photoURL ?? "", "google.com");
		}
		return {
			username,
			avatar_url,
			provider,
			id: user.uid,
			email: user.email ?? "",
		};
	}
	return null;
};

export const getProviderFromFirebaseUser = (user: User) => {
	if (user.providerData[0]?.providerId === "google.com") {
		return "google.com";
	} else {
		return "discord.com";
	}
};

export function getHighQualityAvatar(avatar_url: string, provider: string) {
	if (provider === "google.com") {
		return avatar_url.replace(`s${defaultGoogleAvatarSize}-c`, "s256-c");
	} else {
		return avatar_url;
	}
}

export const getUserEventsData = async (
	snapshot: QuerySnapshot<DocumentData>
) => {
	let lastEventSnapshot: undefined | QueryDocumentSnapshot<DocumentData> =
		undefined;

	let participatingEvents = await Promise.all(
		snapshot.docs.map(async (eventDoc, index) => {
			const rawEventData = eventDoc.data() as RawEventDataFromFirestore;
			const eventFormatted = await formatRawEventData(rawEventData);
			if (index === snapshot.docs.length - 1) {
				lastEventSnapshot = eventDoc;
			}
			return eventFormatted;
		})
	);
	return { participatingEvents, lastEventSnapshot };
};

export const formatRawEventData = async (
	rawEventData: RawEventDataFromFirestore
) => {
	const organizerSnap = await getDoc(rawEventData.organizer_ref);
	if (organizerSnap.exists()) {
		const organizerData = organizerSnap.data() as UserData;

		const formatted = {
			...rawEventData,
			date_range: rawEventData.date_range.map((dateTimestamp, i) =>
				dateTimestamp.toDate()
			),
			hours_range: rawEventData.hours_range.map(
				(utcHour, i) => new Date(utcHour)
			),
			organizer_data: organizerData,
			participants_schedules: rawEventData.participants_schedules.map(
				(schedule) => {
					return {
						date: new Date(schedule.date),
						hours_range: schedule.hours_range.map((hourObj) => ({
							hour: new Date(hourObj.hour),
							participants: hourObj.participants,
							tableElementIndex: hourObj.tableElementIndex,
						})),
					};
				}
			),
		};
		return formatted;
	} else {
		return Promise.reject(
			new Error("Document is corrupt :( no valid Organizer Data")
		);
	}
};

export const getDatesBetweenRange = (start: Date, end: Date): Date[] => {
	const startDate = start.getDate();
	const endDate = end.getDate();
	if (startDate === endDate) {
		return [start];
	} else {
		const prevDate = new Date(end.getTime());
		prevDate.setDate(prevDate.getDate() - 1);
		return [...getDatesBetweenRange(start, prevDate), end];
	}
};

export const getHoursBetweenRange = (start: Date, end: Date): Date[] => {
	const startTime = {
		hours: start.getHours(),
		minutes: start.getMinutes(),
	};
	const endTime = {
		hours: end.getHours(),
		minutes: end.getMinutes(),
	};

	if (
		startTime.hours === endTime.hours &&
		startTime.minutes === endTime.minutes
	) {
		return [start];
	} else {
		const prevHour = new Date(end.getTime());
		prevHour.setMinutes(prevHour.getMinutes() - 30);
		return [...getHoursBetweenRange(start, prevHour), end];
	}
};

export const standardizeHours = (hoursRange: Date[]) => {
	return hoursRange.map((hourObject) => hourObject.toUTCString());
};

export const convertHoursToTimezone = (
	hoursRange: Date[],
	timezoneName: string
) => {
	return hoursRange.map(
		(hour) =>
			new Date(
				new Date(hour.getTime()).toLocaleString("en-US", {
					timeZone: timezoneName,
				})
			)
	);
};

export const getTimezoneMetadata = (timezone: string) => {
	const formattedTimezone = timezone.replace(" ", "_");
	return timeZones.find(
		(tz) =>
			tz.name === formattedTimezone || tz.group.includes(formattedTimezone)
	);
};

// how many participants do we have in total? == 2
// array of hours sorted by numberOfParticipants i.e, doesn't include hours with numberOfParticipants === 0 || null
// [{hour: '7:00am', numberOfParticipants: 2}, {hour: '7:30am', numberOfParticipants: 2} ,  {hour: '8:00am', numberOfParticipants: 1}]
// we loop over this array, finding the hours that have different number of participants
// we create a color palette based on that
// return [
// 	{color: 'hsl(100, 100%, 30%, )', numberOfParticipants: 2},
// 	{color: 'hsl(100, 43%,  70%)', numberOfParticipants: 1}
// ]
// in EventEventAvailabilityTable, we loop over this returned value
// we search for the hours where returned.numberOfParticipants === hour.numberOfParticipants
// we add to them a background color of returned.color
type HourHaveParticipants = {
	hour: Date;
	tableElementIndex: number | null;
	numberOfParticipants: number;
};

export const getColorsBasedOnNumberOfParticipants = (
	hoursHaveParticipants: HourHaveParticipants[]
) => {
	const strongestGreen = "100, 100%, 30%";
	const lightestGreen = "100, 43%,  70%";

	let eventParticipants = [...hoursHaveParticipants];
	let differentParticipantsTotal: HourHaveParticipants[] = [];
	const eventsParticipantsSorted = [...eventParticipants].sort(
		(a, b) => b.numberOfParticipants - a.numberOfParticipants
	);

	const hoursWithDifferentParticipants = eventsParticipantsSorted.filter(
		(hourParticipants) => {
			const participantsAlreadySaved = differentParticipantsTotal.find(
				(saved) => saved.numberOfParticipants === hourParticipants.numberOfParticipants
			);
			if (!participantsAlreadySaved) {
				differentParticipantsTotal.push(hourParticipants);
				return true;
			} else {
				return false;
			}
		}
	);

	const gradient = gradstop({
		stops: hoursWithDifferentParticipants.length,
		inputFormat: "hsl",
		colorArray:
			hoursWithDifferentParticipants.length < 2
				? [strongestGreen]
				: [strongestGreen, lightestGreen],
	});

	return hoursWithDifferentParticipants.map((hourParticipants, i) => {
		return {
			color:
				hoursWithDifferentParticipants.length < 2
					? `hsl(${strongestGreen})`
					: gradient[i],
			numberOfParticipants: hourParticipants.numberOfParticipants,
		};
	});
};
