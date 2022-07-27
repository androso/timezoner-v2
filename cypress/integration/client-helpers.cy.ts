/// <reference types="cypress" />
import {
	getColorsBasedOnNumberOfParticipants,
} from "../../lib/utils/client-helpers";

describe("get color palette from participants", () => {
	it("gives back the strongest green color if only one participant", () => {
		const expected = [
			{
				color: "hsl(100, 100%, 30%)",
				numberOfParticipants: 1,
			},
		];
		const hoursWithParticipants = [
			{
				hour: new Date("jul 27 10:00"),
				numberOfParticipants: 1,
				tableElementIndex: 5,
			},
		];
		const exercise = getColorsBasedOnNumberOfParticipants(
			hoursWithParticipants
		);

		expect(exercise).to.deep.equal(expected);
	});
});
