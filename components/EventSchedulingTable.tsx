import React from "react";
import { Box } from "@air/react-drag-to-select";
import { doc, DocumentReference, updateDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { useRouter } from "next/router";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import { EventData, UserData } from "../lib/utils/types";
import { queryClient } from "../pages/_app";
import toast from "react-hot-toast";

const getInitialSelectedIndexes = (
	eventData: EventData,
	parsedUser: UserData | null
) => {
	let userSelectedHoursIndexes: number[] = [];
	eventData.participants_schedules.forEach((schedule) => {
		schedule.hours_range.forEach((hourRange) => {
			hourRange.participants.forEach((participantRef) => {
				if (
					participantRef.path === `users/${parsedUser?.id}` &&
					typeof hourRange.tableElementIndex === "number"
				) {
					userSelectedHoursIndexes = [
						...userSelectedHoursIndexes,
						hourRange.tableElementIndex,
					];
				}
			});
		});
	});
	return userSelectedHoursIndexes;
};

type PropsTypes = {
	hoursRange: Date[] | undefined | null;
	datesRange: Date[] | undefined;
	eventData: EventData;
};

export default function EventSchedulingTable({
	eventData,
	hoursRange,
	datesRange,
}: PropsTypes) {
	const [dragRoot, setDragRoot] = React.useState<HTMLDivElement | null>(null);
	const router = useRouter();
	const { eventId } = router.query;
	const { parsedUser } = useParsedUserData();
	const $table = React.useRef<HTMLTableElement | null>(null);
	const selectableItems = React.useRef<Box[]>([]);
	const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>(() =>
		getInitialSelectedIndexes(eventData, parsedUser)
	);

	// 		const boxWithAdjustedPosition = {
	// 			...box,
	// 			left: box.left + window.scrollX + ($table.current?.scrollLeft ?? 0),
	// 			top: box.top + window.scrollY,
	// 		};

	// 		const indexesToSelect: number[] = [];
	// 		selectableItems.current.forEach((item, index) => {
	// 			// if (
	// 			// 	boxesIntersect(boxWithAdjustedPosition, item) &&
	// 			// 	selectedIndexes.includes(index) == false
	// 			// ) {
	// 			// 	//indexesToSelect.push(index);
	// 			// }
	// 			if (boxesIntersect(box, item) && !selectedIndexes.includes(index)) {
	// 				indexesToSelect.push(index);
	// 				setDragToSelectWasUsed(true);
	// 				// send to firestore?
	// 			}
	// 		});
	// 		setSelectedIndexes((prevIndexes) => {
	// 			return Array.from(new Set([...prevIndexes, ...indexesToSelect]));
	// 		});
	// 	},
	// 	[selectableItems, $table, selectedIndexes]
	// );

	// TODO: sending data from drag-to-select to firestore, we stopped because this was taking too much time
	// const sendSchedulesBatchToDB = async () => {
	// 	if (!dragToSelectWasUsed) {
	// 		return;
	// 	}
	// 	const $selectableItems = Array.from(document.getElementsByTagName("td"));
	// 	const $selectedItems = $selectableItems.filter(($item) =>
	// 		selectedIndexes.includes(Number($item.dataset.tableElementIndex))
	// 	);
	// 	const times = $selectedItems.map(($item) => ({
	// 		date: $item.dataset.date,
	// 		hour: $item.dataset.hour,
	// 		tableElementIndex: Number($item.dataset.tableElementIndex),
	// 	}));
	// 	// create an array with the number of days as its length
	// 	// updateParticipantScheduleInDB($selectedItems[0]).then(() => console.log("resolved!"));
	// 	console.log("before");

	// 	updateParticipantScheduleInDB($selectedItems[0]);
	// };

	const updateParticipantScheduleInDB = async ($td: HTMLTableCellElement) => {
		// we're updating the participants' schedules client-side, so that we just send an update doc request to firestore
		const tableElementIndex = Number($td.dataset.tableElementIndex);

		const isSelecting = !$td.classList.contains("selected");
		if (
			parsedUser &&
			typeof eventId === "string" &&
			typeof tableElementIndex === "number"
		) {
			const hourSelected = new Date(`${$td.dataset.date} ${$td.dataset.hour}`);
			const userRef = doc(firestore, "users", parsedUser.id);
			//todo: send tableElementIndex?
			const newParticipantsSchedules = eventData.participants_schedules.map(
				(schedule) => {
					return {
						date: schedule.date.toUTCString(),
						hours_range: schedule.hours_range.map((hourRange) => {
							if (hourRange.hour.toUTCString() === hourSelected.toUTCString()) {
								// hourRange already has the correct date
								return {
									hour: hourRange.hour.toUTCString(),
									participants: isSelecting
										? [...hourRange.participants, userRef]
										: hourRange.participants.filter(
												(participant) => participant.path !== userRef.path
										  ),
									tableElementIndex,
								};
							}
							return {
								...hourRange,
								hour: hourRange.hour.toUTCString(),
							};
						}),
					};
				}
			);

			let newParticipantsRefs: DocumentReference[] = [];
			if (!isSelecting && selectedIndexes.length === 1) {
				newParticipantsRefs = newParticipantsRefs.filter(
					(participant) => participant.path !== userRef.path
				);
			} else {
				newParticipantsRefs = [...eventData.participants, userRef];
			}

			try {
				const eventRef = doc(firestore, "events", eventId);
				await updateDoc(eventRef, {
					participants_schedules: newParticipantsSchedules,
					participants: newParticipantsRefs,
				});
				queryClient.invalidateQueries("eventData");
			} catch (e) {
				console.error(e);
				toast.error("something wrong happened when saving your selection");
			}
			return;
		}
	};

	// const { DragSelection } = useSelectionContainer({
	// 	onSelectionChange: () => console.log("selection changed !"),
	// 	selectionProps: {
	// 		style: { display: "none" },
	// 	},
	// 	eventsElement: dragRoot,
	// });

	React.useEffect(() => {
		if (dragRoot && window) {
			Array.from(dragRoot.children).forEach((tableRow) => {
				Array.from(tableRow.children).forEach((tableData) => {
					const elementRect = tableData.getBoundingClientRect();
					selectableItems.current.push({
						left: elementRect.left + window.scrollX,
						top: elementRect.top + window.scrollY,
						width: elementRect.width,
						height: elementRect.height,
					});
				});
			});
		}
	}, [dragRoot]);

	return (
		<div className="flex justify-center">
			{/* <DragSelection /> */}
			<table className="block overflow-x-auto rounded-xl" ref={$table}>
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
				<tbody ref={(newRef) => setDragRoot(newRef)}>
					{hoursRange?.map((hourRange, tableRowIndex) => {
						return (
							<tr key={tableRowIndex}>
								{datesRange?.map((date, tableDataIndex) => {
									// The index relative to how far from the first item we are.
									const tableElementIndex =
										tableRowIndex * datesRange.length + tableDataIndex;
									return (
										<td
											data-table-element-index={tableElementIndex}
											data-date={`${
												date.getMonth() + 1
											}/${date.getDate()}/${date.getFullYear()}`}
											data-hour={`${hourRange.getHours()}:${hourRange.getMinutes()}`}
											className={`px-6 py-4 ${
												selectedIndexes.includes(tableElementIndex)
													? "bg-green-600 selected"
													: "bg-tdBgColor"
											} ${
												tableRowIndex === hoursRange.length - 1
													? "last:rounded-br-xl first:rounded-bl-xl"
													: ""
											}`}
											key={tableDataIndex}
											onClick={(e) => {
												const $td = e.target as HTMLTableCellElement;
												const tableElementIndex = Number(
													$td.dataset.tableElementIndex
												);
												setSelectedIndexes((prevIndexes) => {
													if (prevIndexes.includes(tableElementIndex)) {
														return prevIndexes.filter(
															(selectedIndex) =>
																selectedIndex !== tableElementIndex
														);
													} else {
														return [...prevIndexes, tableElementIndex];
													}
												});

												updateParticipantScheduleInDB(
													e.target as HTMLTableCellElement
												);
											}}
										>
											{hourRange.getHours()}:
											{hourRange.getMinutes() === 0
												? "00"
												: hourRange.getMinutes()}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
