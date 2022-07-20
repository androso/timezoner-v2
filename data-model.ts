const eventModel = {
	organizer_ref: "users/GZXeW7Yj0mmHAG53v1Ht",
	title: "my event title",
	og_timezone: "America/El Salvador",
	id: "3aBKtwKysEpDrPxa0D6J",
	description: "random description",
	date_range: [
		{
			start_date: new Date("jul 15, 2022"), //Timestamp
			end_date: new Date("jul 15, 2022"), //Timestamp
		},
		{
			start_date: new Date("jul 17, 2022"), //Timestamp
			end_date: new Date("jul 20, 2022"), //Timestamp
		},
	],
	hours_range: {
		start_hour: new Date(), // TIMESTAMP => DATE => get hours
		end_hour: new Date(), // eg 15-20
	},
	participants: [
		{
			user_ref: "users/iWB2KBrzkIcGZSd2LMebVL7IwLi2", //reference to the participant document, where we get the username, photo, etc
			dates_available: [
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
