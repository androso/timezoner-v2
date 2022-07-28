import React, { useState } from "react";
import { getColorsBasedOnNumberOfParticipants } from "../lib/utils/client-helpers";
import { EventData } from "../lib/utils/types";
type PropsTypes = {
	hoursRange: Date[] | undefined | null;
	datesRange: Date[] | undefined;
	eventData: EventData;
};
export default function EventAvailabilityTable({
	eventData,
	hoursRange,
	datesRange,
}: PropsTypes) {
	const [colorsBasedOnParticipantsTotal] = useState(() => {
		const hoursHaveParticipants = eventData.participants_schedules
			.map((schedule) => {
				const result = schedule.hours_range
					.filter((hourRange) => hourRange.participants.length >= 1)
					.map((hourRange) => ({
						hour: hourRange.hour,
						tableElementIndex: hourRange.tableElementIndex,
						numberOfParticipants: hourRange.participants.length,
					}));
				return result;
			})
			.flat();
		if (hoursHaveParticipants.length >= 1) {
			return getColorsBasedOnNumberOfParticipants(hoursHaveParticipants);
		}
		return [];
	});
	console.log(colorsBasedOnParticipantsTotal);
	const map = [
		{
			tableElementIndex: 0,
			hour: new Date(),
			participantsNumber: 3,
		},
		{
			tableElementIndex: 1,
			hour: new Date(), // hour will have the correct date :)
			participantNumber: 2,
		},
	];
	return (
		<table className="block overflow-x-auto rounded-xl">
			<thead>
				<tr>
					{datesRange &&
						datesRange.map((date, index) => (
							<th
								className="py-3 px-6 bg-gradient-to-b from-[#6C747A] to-[#4B565D] last:rounded-tr-xl first:rounded-tl-xl"
								key={index}
							>
								<span className="block text-left">
									{date.toLocaleString("default", {
										month: "short",
										day: "numeric",
									})}{" "}
								</span>
								<span className="block text-left">
									{date.toLocaleString("default", {
										weekday: "long",
									})}
								</span>
							</th>
						))}
				</tr>
			</thead>
			<tbody>
				{hoursRange?.map((hourObj, tableRowIndex) => {
					return (
						<tr key={tableRowIndex}>
							{datesRange?.map((date, tableDataIndex) => {
								// The index relative to how far from the first item we are.
								const tableElementIndex =
									tableRowIndex * datesRange.length + tableDataIndex;
								const defaultBgColor = "hsla(224, 33%, 94%, .15)";
								const backgroundColor =
									colorsBasedOnParticipantsTotal.find((colorObj) =>
										colorObj.tableElementIndexes.includes(tableElementIndex)
									)?.color ?? defaultBgColor;
								const backgroundColorLightness = Number(
									backgroundColor.match(/\d\d/g)[2]
								);
								return (
									<td
										data-table-element-index={tableElementIndex}
										data-date={`${
											date.getMonth() + 1
										}/${date.getDate()}/${date.getFullYear()}`}
										data-hour={`${hourObj.getHours()}:${hourObj.getMinutes()}`}
										className={`px-6 py-4 ${
											tableRowIndex === hoursRange.length - 1
												? "last:rounded-br-xl first:rounded-bl-xl"
												: ""
										}`}
										style={{
											backgroundColor,
											color:
												backgroundColorLightness > 44 &&
												backgroundColor !== defaultBgColor
													? "#333"
													: "white",
										}}
										key={tableDataIndex}
									>
										{hourObj.getHours()}:
										{hourObj.getMinutes() === 0 ? "00" : hourObj.getMinutes()}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
