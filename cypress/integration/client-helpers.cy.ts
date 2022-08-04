import {
	formatRawEventDataTest,
	getColorsBasedOnNumberOfParticipants,
	getFormattedFormData,
	useEventDataBasedOnTimezone,
} from "../../lib/utils/client-helpers";
import { EventData, RawEventDataFromFirestore } from "../../lib/utils/types";

describe("get color palette from participants", () => {
	const strongestColor = "hsl(142, 99%, 29%)";
	const lightestColor = "hsl(109, 62%, 70%)";

	it("gives back the strongest green color if only one participant", () => {
		const expected = [
			{
				color: strongestColor,
				numberOfParticipants: 1,
				tableElementIndexes: [0],
			},
		];
		2;
		const eventParticipants = [
			{
				hour: new Date("jul 17 10:00"),
				tableElementIndex: 0,
				numberOfParticipants: 1,
			},
		];
		const exercise = getColorsBasedOnNumberOfParticipants(eventParticipants);
		expect(exercise).to.deep.equal(expected);
	});
	it("gives back strongest and lightest color if only two participant", () => {
		const expected = [
			{
				color: strongestColor,
				numberOfParticipants: 5,
				tableElementIndexes: [0],
			},
			{
				color: lightestColor,
				numberOfParticipants: 2,
				tableElementIndexes: [1],
			},
		];
		const eventParticipants = [
			{
				hour: new Date("jul 17 10:00"),
				tableElementIndex: 0,
				numberOfParticipants: 5,
			},
			{
				hour: new Date("jul 17 10:00"),
				tableElementIndex: 1,
				numberOfParticipants: 2,
			},
		];

		const result = getColorsBasedOnNumberOfParticipants(eventParticipants);
		expect(result).to.deep.equal(expected);
	});
	it("generates correct color palette when provided more than 2 participants", () => {
		const expected = [
			{
				color: strongestColor,
				numberOfParticipants: 5,
				tableElementIndexes: [0],
			},
			{
				color: "hsl(125, 80%, 49%)",
				numberOfParticipants: 4,
				tableElementIndexes: [0],
			},
			{
				color: lightestColor,
				numberOfParticipants: 2,
				tableElementIndexes: [0],
			},
		];
		const eventsParticipants = [
			{
				hour: new Date("jul 17 10:00"),
				tableElementIndex: 0,
				numberOfParticipants: 4,
			},
			{
				hour: new Date("jul 17 10:00"),
				tableElementIndex: 0,
				numberOfParticipants: 5,
			},
			{
				hour: new Date("jul 17 10:00"),
				tableElementIndex: 0,
				numberOfParticipants: 2,
			},
		];

		const result = getColorsBasedOnNumberOfParticipants(eventsParticipants);
		expect(result).to.deep.equal(expected);
	});
});

describe("getFormattedFormData", () => {
	// returns data ready to be sent to firestore
	//todo: change the name
	const baseData = {
		description: "hey description",
		title: "Event title",
	};
	// CASE A:
	// timezone: Istanbul
	// Date: aug 1
	// start_hour: 2:30am
	// end_hour: 3:30am

	// CASE C:
	// timezone: El Salvador
	// Date: aug 1 =>debugger; aug 1
	// start_hour: 11:00pm
	// end_hour: 11:30pm

	describe("CASE A", () => {
		// hours are based in el salvador timezone (local)
		const data = {
			...baseData,
			timezone: "Europe/Istanbul",
			hours_range: {
				start_hour: new Date(
					"Sun Jul 31 2022 17:30:00 GMT-0600 (Central Standard Time)"
				),
				end_hour: new Date(
					"Sun Jul 31 2022 18:30:00 GMT-0600 (Central Standard Time)"
				),
			},
			date: new Date(
				"Mon Aug 01 2022 00:00:00 GMT-0600 (Central Standard Time)"
			),
		};
		it("returns correct date_range when provided with case A", () => {
			const expected = {
				date_range: ["7/31/2022", "8/1/2022"],
			};
			const result = getFormattedFormData(data, "23", "890");
			expect(result.date_range).to.deep.equal(expected.date_range);
		});
		it("returns correct hours_range when provided with case A", () => {
			const expected = {
				hours_range: [
					"Sun, 31 Jul 2022 23:30:00 GMT",
					"Mon, 01 Aug 2022 00:00:00 GMT",
					"Mon, 01 Aug 2022 00:30:00 GMT",
				],
			};
			const result = getFormattedFormData(data, "23", "890");
			expect(result.hours_range).to.deep.equal(expected.hours_range);
		});
		it("returns correct participants_schedule", () => {
			const expected = {
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
								hour: "Mon, 01 Aug 2022 00:00:00 GMT",
								participants: [],
								tableElementIndex: null,
							},
							{
								hour: "Mon, 01 Aug 2022 00:30:00 GMT",
								participants: [],
								tableElementIndex: null,
							},
						],
					},
				],
			};

			const result = getFormattedFormData(data, "23", "890 ");
			expect(result.participants_schedules).to.deep.equal(
				expected.participants_schedules
			);
		});
	});

	describe("CASE C", () => {
		const formData = {
			...baseData,
			timezone: "America/El Salvador",
			hours_range: {
				start_hour: new Date(
					"Aug 01 2022 23:00:00 GMT-0600 (Central Standard Time)"
				),
				end_hour: new Date(
					"Aug 01 2022 23:30:00 GMT-0600 (Central Standard Time)"
				),
			},
			date: new Date("Aug 01 2022 00:00:00 GMT-0600 (Central Standard Time)"),
		};
		const expectedData = {
			date_range: ["8/2/2022"],
			hours_range: [
				"Tue, 02 Aug 2022 05:00:00 GMT",
				"Tue, 02 Aug 2022 05:30:00 GMT",
			],
			participants_schedules: [
				{
					date: "8/2/2022",
					hours_range: [
						{
							hour: "Tue, 02 Aug 2022 05:00:00 GMT",
							participants: [],
							tableElementIndex: null,
						},
						{
							hour: "Tue, 02 Aug 2022 05:30:00 GMT",
							participants: [],
							tableElementIndex: null,
						},
					],
				},
			],
		};
		const resultData = getFormattedFormData(formData, "23", "890");
		it("returns correct date_range when provided with case C", () => {
			expect(resultData.date_range).to.deep.equal(expectedData.date_range);
		});
		it("returns correct hours_range when provided with case C", () => {
			expect(resultData.hours_range).to.deep.equal(expectedData.hours_range);
		});
		it("returns correct participants_schedules", () => {
			expect(resultData.participants_schedules).to.deep.equal(
				expectedData.participants_schedules
			);
		});
	});
});

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
			hours_range: [
				"Tues, 02 Aug 2022 05:00:00 GMT",
				"Tues, 02 Aug 2022 05:30:00 GMT",
			],
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
		};
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
	});
});

describe("useEventDataBasedOnTimezone", async () => {
	// the function will receive an eventData (queried and formatted from firestore)
	// and will output an eventData based on that timezone
	// Useful if we add a timezone select for the user to change to whatever timezone they want
	// will update all time-related stuff to match the timezone selected
	describe("CASE A", () => {
		const eventData = {
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
		describe("America/El Salvador => Europe/Istanbul", () => {
			const expectedEventData = {
				date_range: [
					new Date("Mon Aug 01 2022 00:00:00 GMT-0600 (Central Standard Time)"),
				],
				hours_range: [
					new Date("Mon Aug 01 2022 02:30:00 GMT-0600 (Central Standard Time)"), // mocking istanbul timezone
					new Date("Mon Aug 01 2022 03:00:00 GMT-0600 (Central Standard Time)"),
					new Date("Mon Aug 01 2022 03:30:00 GMT-0600 (Central Standard Time)"),
				],
				participants_schedules: [
					{
						date: new Date(
							"Mon Aug 01 2022 00:00:00 GMT-0600 (Central Standard Time)"
						),
						hours_range: [
							{
								hour: new Date(
									"Mon Aug 01 2022 02:30:00 GMT-0600 (Central Standard Time)"
								),
								participants: [],
								tableElementIndex: null,
							},
							{
								hour: new Date(
									"Mon Aug 01 2022 03:00:00 GMT-0600 (Central Standard Time)"
								),
								participants: [],
								tableElementIndex: null,
							},
							{
								hour: new Date(
									"Mon Aug 01 2022 03:30:00 GMT-0600 (Central Standard Time)"
								),
								participants: [],
								tableElementIndex: null,
							},
						],
					},
				],
			};
			const resultEventData = useEventDataBasedOnTimezone(
				eventData as unknown as EventData,
				"Europe/Istanbul"
			);

			it("converts hours_range from SV to Istanbul", () => {
				expect(resultEventData?.hours_range).to.deep.equal(
					expectedEventData.hours_range
				);
			});
			it("converts date_range from SV to istanbul", () => {
				expect(resultEventData?.date_range).to.deep.equal(
					expectedEventData.date_range
				);
			});
			it("converts correctly participants_schedules", () => {
				expect(resultEventData?.participants_schedules).to.deep.equal(
					expectedEventData.participants_schedules
				);
			});
		});
	});
});
