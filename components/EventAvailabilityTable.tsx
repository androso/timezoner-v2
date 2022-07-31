import React, { useEffect, useState } from "react";
import { getColorsBasedOnNumberOfParticipants } from "../lib/utils/client-helpers";
import { EventData, UserData } from "../lib/utils/types";
import ReactModal from "react-modal";
import { getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

ReactModal.setAppElement("body");

type PropsTypes = {
	hoursRange: Date[] | undefined | null;
	datesRange: Date[] | undefined;
	eventData: EventData;
};

//! when user turns on the dialog, we can calculate the height of this based on how many participants are we requesting and then add it to the style.height of page-wrapper, who in turn, has to have a overflow of hidden
//! This is just a hack?

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
	const [showDialog, setShowDialog] = useState(false);
	const open = () => setShowDialog(true);
	const close = () => setShowDialog(false);
	const [selectedHour, setselectedHour] = useState<{
		participants: UserData[] | null;
		position: { x: number; y: number };
	} | null>(null);
	const updateParticipantsList = async (event: React.MouseEvent) => {
		const $td = event.target as HTMLTableCellElement;
		// getting the position of $td relative to the top of the table

		const thPosition = document
			.querySelector("th")
			?.getBoundingClientRect() as DOMRect;

		const $tdPosition = $td.getBoundingClientRect();
		// get absolute position of th
		// get absolute position of td
		// td - th == top

		const tableElementIndex = $td.dataset.tableElementIndex;
		const dateSelected = new Date($td.dataset.date ?? ""); // Fri Jul 29 2022 00:00:00 GMT-0600 (Central Standard Time)
		const scheduleSelected = eventData.participants_schedules.find(
			(schedule) => schedule.date.toUTCString() === dateSelected.toUTCString()
		);
		const hourSelected = scheduleSelected?.hours_range.find(
			(hourObj) => hourObj.tableElementIndex === Number(tableElementIndex)
		);

		if (hourSelected && hourSelected.participants.length >= 1) {
			try {
				const participants = (await Promise.all(
					hourSelected.participants.map(async (ref) => {
						const snap = await getDoc(ref);
						if (snap.exists()) {
							return snap.data();
						}
					})
				)) as UserData[];
				setselectedHour({
					participants,
					position: {
						x: $tdPosition.left + window.scrollX,
						y:
							$tdPosition.top +
							window.scrollY -
							(thPosition.top + window.scrollY),
					},
				});
				setShowDialog(true);
			} catch (e) {
				toast.error("Error while fetching participants");
				throw new Error("Error while fetching participants");
			}
		} else {
			setShowDialog(true);
			setselectedHour({
				participants: null,
				position: {
					x: $tdPosition.left + window.scrollX,
					y:
						$tdPosition.top +
						window.scrollY -
						(thPosition.top + window.scrollY),
				},
			});
		}
	};

	useEffect(() => {
		console.log(selectedHour);
	}, [selectedHour]);
	return (
		<div id="availability-container" className="relative w-full flex">
			<table className="block overflow-x-auto rounded-xl max-w-[219px]">
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
											onClick={updateParticipantsList}
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
			{showDialog && (
				<div
					className={`bg-black w-[140px] h-[286px] rounded-md px-3 py-2 absolute left-[190px] `}
					style={{
						top: selectedHour?.position.y,
					}}
				>
					<div className="flex justify-between border-b border-white">
						<p>Available</p>
						<button onClick={() => setShowDialog(false)}>X</button>
					</div>
					<ul>
						{selectedHour?.participants == null ? (
							<li>No participants found</li>
						) : (
							selectedHour.participants.map((participant, i) => {
								return (
									<li
										key={participant.id}
										className={`${
											selectedHour.participants?.length === i + 1 &&
											"border-b border-white"
										}`}
									>
										{participant.username.split(" ")[0]}
									</li>
								);
							})
						)}
					</ul>
				</div>
			)}
		</div>
	);
}
