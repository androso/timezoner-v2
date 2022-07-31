import { getColorsBasedOnNumberOfParticipants } from "../../lib/utils/client-helpers";

describe("get color palette from participants", () => {
	const strongestColor = "hsl(100, 100%, 30%)";
	const lightestColor = "hsl(100, 43%, 70%)";

	it("gives back the strongest green color if only one participant", () => {
		const expected = [
			{
				color: strongestColor,
				numberOfParticipants: 1,
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
			},
			{
				color: lightestColor,
				numberOfParticipants: 2,
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
			},
			{
				color: "hsl(100, 71%, 50%)",
				numberOfParticipants: 4,
			},
			{
				color: lightestColor,
				numberOfParticipants: 2,
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