import { doc } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import {
	formatRawEventData,
	formatRawEventDataTest,
	getColorsBasedOnNumberOfParticipants,
	getFormattedFormData,
	useEventDataBasedOnTimezone,
} from "../../lib/utils/client-helpers";
import {
	dateRange,
	EventData,
	RawEventDataFromFirestore,
} from "../../lib/utils/types";

// describe("get color palette from participants", () => {
// 	const strongestColor = "hsl(100, 100%, 30%)";
// 	const lightestColor = "hsl(100, 43%, 70%)";

// 	it("gives back the strongest green color if only one participant", () => {
// 		const expected = [
// 			{
// 				color: strongestColor,
// 				numberOfParticipants: 1,
// 			},
// 		];
// 		2;
// 		const eventParticipants = [
// 			{
// 				hour: new Date("jul 17 10:00"),
// 				tableElementIndex: 0,
// 				numberOfParticipants: 1,
// 			},
// 		];
// 		const exercise = getColorsBasedOnNumberOfParticipants(eventParticipants);
// 		expect(exercise).to.deep.equal(expected);
// 	});
// 	it("gives back strongest and lightest color if only two participant", () => {
// 		const expected = [
// 			{
// 				color: strongestColor,
// 				numberOfParticipants: 5,
// 			},
// 			{
// 				color: lightestColor,
// 				numberOfParticipants: 2,
// 			},
// 		];
// 		const eventParticipants = [
// 			{
// 				hour: new Date("jul 17 10:00"),
// 				tableElementIndex: 0,
// 				numberOfParticipants: 5,
// 			},
// 			{
// 				hour: new Date("jul 17 10:00"),
// 				tableElementIndex: 1,
// 				numberOfParticipants: 2,
// 			},
// 		];

// 		const result = getColorsBasedOnNumberOfParticipants(eventParticipants);
// 		expect(result).to.deep.equal(expected);
// 	});
// 	it("generates correct color palette when provided more than 2 participants", () => {
// 		const expected = [
// 			{
// 				color: strongestColor,
// 				numberOfParticipants: 5,
// 			},
// 			{
// 				color: "hsl(100, 71%, 50%)",
// 				numberOfParticipants: 4,
// 			},
// 			{
// 				color: lightestColor,
// 				numberOfParticipants: 2,
// 			},
// 		];
// 		const eventsParticipants = [
// 			{
// 				hour: new Date("jul 17 10:00"),
// 				tableElementIndex: 0,
// 				numberOfParticipants: 4,
// 			},
// 			{
// 				hour: new Date("jul 17 10:00"),
// 				tableElementIndex: 0,
// 				numberOfParticipants: 5,
// 			},
// 			{
// 				hour: new Date("jul 17 10:00"),
// 				tableElementIndex: 0,
// 				numberOfParticipants: 2,
// 			},
// 		];

// 		const result = getColorsBasedOnNumberOfParticipants(eventsParticipants);
// 		expect(result).to.deep.equal(expected);
// 	});
// });

// describe("getFormattedFormData", () => {
// 	// returns data ready to be sent to firestore
// 	//todo: change the name
// 	const baseData = {
// 		description: "hey description",
// 		title: "Event title",
// 	};
// 	// CASE A:
// 	// timezone: Istanbul
// 	// Date: aug 1 => aug 1
// 	// start_hour: 2:30am
// 	// end_hour: 3:30am

// 	// CASE B:
// 	// timezone: Istanbul
// 	// Date: aug 1 => aug 3
// 	// start_hour: 2:30am
// 	// end_hour: 3:30am

// 	// CASE C:
// 	// timezone: El Salvador
// 	// Date: aug 1 =>debugger; aug 1
// 	// start_hour: 11:00pm
// 	// end_hour: 11:30pm

// 	// CASE D:
// 	// timezone: El Salvador
// 	// Date: aug 1 => aug 3
// 	// start_hour: 11:00pm
// 	// end_hour: 11:30pm

// 	describe("CASE A", () => {
// 		// hours are based in el salvador timezone (local)
// 		const data = {
// 			...baseData,
// 			timezone: "Europe/Istanbul",
// 			hours_range: {
// 				start_hour: new Date(
// 					"Sun Jul 31 2022 17:30:00 GMT-0600 (Central Standard Time)"
// 				),
// 				end_hour: new Date(
// 					"Sun Jul 31 2022 18:30:00 GMT-0600 (Central Standard Time)"
// 				),
// 			},
// 			dateRange: [
// 				new Date("Mon Aug 01 2022 00:00:00 GMT-0600 (Central Standard Time)"),
// 				new Date("Mon Aug 01 2022 00:00:00 GMT-0600 (Central Standard Time)"),
// 			] as [Date, Date],
// 		};
// 		it("returns correct date_range when provided with case A", () => {
// 			const expected = {
// 				date_range: ["7/31/2022", "8/1/2022"],
// 			};
// 			const result = getFormattedFormData(data, "23", "890");
// 			expect(result.date_range).to.deep.equal(expected.date_range);
// 		});
// 		it("returns correct hours_range when provided with case A", () => {
// 			const expected = {
// 				hours_range: [
// 					"Sun, 31 Jul 2022 23:30:00 GMT",
// 					"Mon, 01 Aug 2022 00:00:00 GMT",
// 					"Mon, 01 Aug 2022 00:30:00 GMT",
// 				],
// 			};
// 			const result = getFormattedFormData(data, "23", "890");
// 			expect(result.hours_range).to.deep.equal(expected.hours_range);
// 		});
// 	});

// 	describe("CASE B", () => {
// 		it("returns correct date_range when provided with case B", () => {
// 			//todo write this
// 		});
// 	});
// });

describe("formatRawEventData", () => {
	describe("CASE A", () => {
		const rawEventData = {
			date_range: ["7/31/2022", "8/1/2022"],
			hours_range: [
				"Sun, 31 Jul 2022 23:30:00 GMT",
				"Mon, 01 Aug 2022 00:00:00 GMT",
				"Mon, 01 Aug 2022 00:30:00 GMT",
			],
			participants_schedules: [
				{
					date: "7/31/2022",
					hours_range: [
						{
							hour: "Sun, 31 Jul 2022 23:30:00 GMT",
							participants: [],
							tableElementIndex: null,
						},
					],
				},
				{
					date: "8/1/2022",
					hours_range: [
						{
							hour: "Sun, 1 Aug 2022 00:00:00 GMT",
							participants: [],
							tableElementIndex: null,
						},
						{
							hour: "Sun, 1 Aug 2022 00:30:00 GMT",
							participants: [],
							tableElementIndex: null,
						},
					],
				},
			],
		};
		const expectedEventData = {
			hours_range: [
				new Date("Sun Jul 31 2022 17:30:00 GMT-0600 (Central Standard Time)"),
				new Date("Sun Jul 31 2022 18:00:00 GMT-0600 (Central Standard Time)"),
				new Date("Sun Jul 31 2022 18:30:00 GMT-0600 (Central Standard Time)"),
			],
			date_range: [
				new Date("Sun Jul 31 2022 00:00:00 GMT-0600 (Central Standard Time)"),
			],
			participants_schedules: [
				{
					date: new Date(
						"Sun Jul 31 2022 00:00:00 GMT-0600 (Central Standard Time)"
					),
					hours_range: [
						{
							hour: new Date(
								"Sun Jul 31 2022 17:30:00 GMT-0600 (Central Standard Time)"
							),
							participants: [],
							tableElementIndex: null,
						},
						{
							hour: new Date(
								"Sun Jul 31 2022 18:00:00 GMT-0600 (Central Standard Time)"
							),
							participants: [],
							tableElementIndex: null,
						},
						{
							hour: new Date(
								"Sun Jul 31 2022 18:30:00 GMT-0600 (Central Standard Time)"
							),
							participants: [],
							tableElementIndex: null,
						},
					],
				},
			],
		};
		const resultEventData = formatRawEventDataTest(
			rawEventData as unknown as RawEventDataFromFirestore
		);
		it("returns correct hours_range", () => {
			expect(resultEventData.hours_range).to.deep.equal(
				expectedEventData.hours_range
			);
		});
		it("returns correct date_range", () => {
			expect(resultEventData.date_range).to.deep.equal(
				expectedEventData.date_range
			);
		});
		it("returns correct participants_schedule", () => {
			expect(resultEventData.participants_schedules).to.deep.equal(
				expectedEventData.participants_schedules
			);
		});
	});
	describe("CASE C", () => {
		const rawEventData = {
			date_range: ["8/2/2022"],
			hours_range: ["Tues, 02 Aug 2022 05:00:00 GMT", "Tues, 02 Aug 2022 05:30:00 GMT"],
			participants_schedules: [
				{
					date: "8/2/2022",
					hours_range: [
						{
							hour: "Tues, 02 Aug 2022 05:00:00 GMT",
							participants: [],
							tableElementIndex: null,
						},
						{
							hour: "Tues, 02 Aug 2022 05:30:00 GMT",
							participants: [],
							tableElementIndex: null,
						},
					],
				},
			],
		}
		const expectedEventData = {
			date_range: [
				new Date("Mon Aug 01 2022 00:00:00 GMT-0600 (Central Standard Time)"),
			],
			hours_range: [
				new Date("Mon Aug 01 2022 23:00:00 GMT-0600 (Central Standard Time)"),
				new Date("Mon Aug 01 2022 23:30:00 GMT-0600 (Central Standard Time)"),
			],
			participants_schedules: [
				{
					date: new Date(
						"Mon Aug 01 2022 00:00:00 GMT-0600 (Central Standard Time)"
					),
					hours_range: [
						{
							hour: new Date(
								"Mon Aug 01 2022 23:00:00 GMT-0600 (Central Standard Time)"
							),
							participants: [],
							tableElementIndex: null,
						},
						{
							hour: new Date(
								"Mon Aug 01 2022 23:30:00 GMT-0600 (Central Standard Time)"
							),
							participants: [],
							tableElementIndex: null,
						},
					],
				},
			],
		}
		const resultEventData = formatRawEventDataTest(
			rawEventData as unknown as RawEventDataFromFirestore
		);
		it ("returns correct hours_range", () => {
			expect(resultEventData.hours_range).to.deep.equal(expectedEventData.hours_range)
		})
		it ("returns correct date_range", () => {
			expect(resultEventData.date_range).to.deep.equal(expectedEventData.date_range);
		})
	})
});

// describe("useEventDataBasedOnTimezone", async () => {
// 	// the function will receive an eventData (queried and formatted from firestore)
// 	// and will output a eventData based on the timezone
// 	// will update all time-related stuff to match the timezone selected
// 	//todo find a data model that will allow us to make this operation
// 	// this would be the data received from calling formatRawEventData
// });
