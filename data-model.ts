// Creating events

// There seems to be 4 edge-cases
// A)
const dataA = {
	timezone: "Europe/Istanbul",
	dateRange: [new Date("1 aug 2022"), new Date("1 aug 2022")],
	hourRange: {
		start_hour: new Date("2:30"),
		end_hour: new Date("3:30"),
	},
};
// expected output
const dataAOutput = {
	date_range: ["7/31/2022", "8/1/2022"],
	hour_range: ["23:30:00 GMT", "00:00:00 GMT", "00:30:00 GMT"],
	participants_schedule: [
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

const dataB = {
	timezone: "Europe/Istanbul",
	dateRange: [new Date("1 aug 2022"), new Date("3 aug 2022")],
	hourRange: {
		start_hour: new Date("2:30"),
		end_hour: new Date("3:30"),
	},
};

const dataBOutput = {
	date_range: ["7/31/2022", "8/1/2022", "8/2/2022"],
	hour_range: [
		// Here only the hours matter
		"Sun, 31 Jul 2022 23:30:00 GMT",
		"Mon, 01 Aug 2022 00:00:00 GMT",
		"Mon, 01 Aug 2022 00:30:00 GMT",
	],
	participants_schedule: [
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
				{
					hour: "Mon, 01 Aug 2022 23:30:00 GMT",
					participants: [],
					tableElementIndex: null,
				},
			],
		},
		{
			date: "8/2/2022",
			hours_range: [
				{
					hour: "Tues, 02 Aug 2022 00:00:00 GMT",
					participants: [],
					tableElementIndex: null,
				},
				{
					hour: "Tues, 02 Aug 2022 00:30:00 GMT",
					participants: [],
					tableElementIndex: null,
				},
				{
					hour: "Tues, 02 Aug 2022 23:30:00 GMT",
					participants: [],
					tableElementIndex: null,
				},
			],
		},
	],
};
const participantsModel = [
	{
		user_ref: "",
		dates_available: [
			{
				date: "july 23",
				hours_selected: ["7:30", "8:00", "9:00"], // we could save as Date
			},
			{
				date: "july 25",
				hours_selected: ["8:30"],
			},
		],
	},
];

const eventModel = {
	organizer_ref: "users/GZXeW7Yj0mmHAG53v1Ht",
	title: "my event title",
	og_timezone: "America/El Salvador",
	id: "3aBKtwKysEpDrPxa0D6J",
	description: "random description",
	date_range: [
		new Date("jul 15, 2022"), //Timestamp
		new Date("jul 15, 2022"), //Timestamp
	],
	hours_range: [
		"Sat, 23 Jul 2022 15:30:00 GMT",
		"Sat, 23 Jul 2022 16:30:00 GMT",
	],
	time_range: [
		{
			date: "Jul 23 2022",
			hours_range: [
				"Sat, 23 Jul 2022 15:30:00 GMT",
				"Sat, 23 Jul 2022 16:30:00 GMT",
			],
		},
		{
			date: "Jul 24 2022",
			hours_range: [
				"Sat, 23 Jul 2022 15:30:00 GMT",
				"Sat, 23 Jul 2022 16:30:00 GMT",
			],
		},
	],
	participants: [
		{
			user_ref: "users/iWB2KBrzkIcGZSd2LMebVL7IwLi2", //reference to the participant document, where we get the username, photo, etc
			dates_available: [
				{
					date: new Date("jul 14"),
					hours_ranges: [
						{
							start_hour: new Date("12:30pm"),
							end_hour: new Date("12:30pm"),
						},
					],
				},
				{
					date: new Date("jul 21"),
					hours_ranges: [
						{
							start_hour: new Date("7:30am"),
							end_hour: new Date("8:00am"),
						},
					],
				},
				{
					date: new Date("Jul 22"),
					hours_range: [
						{
							start_hour: new Date("8:00am"),
							end_hour: new Date("8:30am"),
						},
					],
				},
				{
					date: new Date("Jul 23"),
					hours_range: [
						{
							start_hour: new Date("8:00am"),
							end_hour: new Date("8:30am"),
						},
					],
				},
			],
		},
	],
};

const eventModelV1 = {
	organizer_ref: "users/GZXeW7Yj0mmHAG53v1Ht",
	title: "my event title",
	og_timezone: "America/El Salvador",
	id: "3aBKtwKysEpDrPxa0D6J",
	description: "random description",
	date_range: {
		start_date: new Date("jul 15, 2022"), //Timestamp
		end_date: new Date("jul 15, 2022"), //Timestamp
	},
	hours_range: {
		start_hour: new Date(), // TIMESTAMP => DATE => get hours
		end_hour: new Date(), // eg 15-20
	},
	participants: [
		{
			user_ref: "users/iWB2KBrzkIcGZSd2LMebVL7IwLi2", //reference to the participant document, where we get the username, photo, etc
			// user participates in these dates at these hours
			// Each date will have its own hour_ranges. Saturday (12pm - 13pm), (15pm - 18pm)
			schedules: [
				{
					date: new Date("jul 21"),
					hours_range: [
						{
							start_hour: new Date("7:30am"),
							end_hour: new Date("8:00am"),
						},
					],
				},
				{
					date: new Date("Jul 22"),
					hours_range: [
						{
							start_hour: new Date("8:00am"),
							end_hour: new Date("8:30am"),
						},
					],
				},
				{
					date: new Date("Jul 23"),
					hours_range: [
						{
							start_hour: new Date("8:00am"),
							end_hour: new Date("8:30am"),
						},
					],
				},
			],
		},
	],
};

const UserData = {
	username: "adnroso",
	email: "androso@gmail.com",
	provider: "google.com",
	avatar_url: "lh3.blabla.com",
	id: "user id",
	events: {
		organizing: [
			"events/hz1GqGBUUVSqX8wmsPJV",
			"events/hun8zxiR4mUFuD7ETUaQ",
			"events/SlARtv017HiL8rrlN7aq",
		],
		participating: [
			"events/qSqX8wmsGBUUVPJVhz1G",
			"events/ORKkbmY35JsmswPRclaN",
			"events/Wvw9WySZLHLsRYn1B6pE",
			"events/bypE7NoWJadvUnaJi0nU",
		],
	},
};

// alexa only can jul 17

export default eventModel;
