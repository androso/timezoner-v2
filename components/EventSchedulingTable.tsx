import React from "react";
import {
	useSelectionContainer,
	boxesIntersect,
	Box,
} from "@air/react-drag-to-select";
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { useRouter } from "next/router";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import { EventData, RawParticipant, UserData } from "../lib/utils/types";
import {
	getDatesBetweenRange,
	getHoursBetweenRange,
} from "../lib/utils/client-helpers";
import { queryClient } from "../pages/_app";
import { timeZones } from "../lib/timezonesData";
import toast from "react-hot-toast";
import isEqual from "lodash.isequal";

const getInitialSelectedIndexes = (
	eventData: EventData,
	parsedUser: UserData | null
) => {
	const userParticipantObject = eventData.participants.find(
		(participant) => participant.user_ref.path === `users/${parsedUser?.id}`
	);
	if (userParticipantObject) {
		let hoursSelectedIndexes: number[] = [];
		userParticipantObject.dates_available.forEach((dateObj) => {
			hoursSelectedIndexes = [
				...hoursSelectedIndexes,
				...dateObj.hours_selected.map((hourObj) => hourObj.tableElementIndex),
			];
		});

		return hoursSelectedIndexes;
	}
	return [];
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
	// const [dragToSelectWasUsed, setDragToSelectWasUsed] = React.useState(false);
	// make this function be called only when the position of the mouse has exceeded a box(?)
	// const onSelectionChange = React.useCallback(
	// 	async (box: Box) => {
	// 		//! We update the values of the box that we receive, because those are relative to the viewport, not the document
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
		const tableElementIndex = Number($td.dataset.tableElementIndex);

		const isSelecting = !$td.classList.contains("selected");
		if (parsedUser && typeof eventId === "string") {
			const date = new Date($td.dataset.date ?? "");
			const hour = new Date(`${$td.dataset.date} ${$td.dataset.hour}`);
			const utcHour = hour.toUTCString();
			const currentParticipant = eventData.participants.find(
				(participant) => participant.user_ref.id === parsedUser.id
			);
			if (isSelecting) {
				// we want to send to firestore

				if (currentParticipant) {
					// if it's the second hour we add
					const dateIsAlreadySaved =
						currentParticipant.dates_available.findIndex(
							(date_available) => date_available.date === date.toUTCString()
						);
					let dataSent = {
						user_ref: currentParticipant.user_ref,
						dates_available: [...currentParticipant.dates_available],
					} as unknown as RawParticipant;

					if (dateIsAlreadySaved !== -1) {
						// console.log("second onwards hour that we add to the same day");
						dataSent.dates_available[dateIsAlreadySaved] = {
							date: date.toUTCString(),
							hours_selected: [
								...dataSent.dates_available[dateIsAlreadySaved].hours_selected,
								{ hour: utcHour, tableElementIndex },
							],
						};
					} else {
						// console.log("we're adding an hour from a different day");
						dataSent.dates_available = [
							...dataSent.dates_available,
							{
								date: date.toUTCString(),
								hours_selected: [
									{
										hour: utcHour,
										tableElementIndex,
									},
								],
							},
						];
					}

					try {
						const eventRef = doc(firestore, "events", eventId);
						await updateDoc(eventRef, {
							participants: [
								...eventData.participants.filter(
									(participant) =>
										participant.user_ref.path !== `users/${parsedUser.id}`
								),
								dataSent,
							],
						});
						queryClient.invalidateQueries("eventData");
						console.log("saved!");
					} catch (e) {
						console.error(e);
						toast.error("Something wrong happend when saving to database");
					}
				} else {
					const dataSent = {
						user_ref: doc(firestore, "users", parsedUser?.id ?? ""),
						dates_available: [
							{
								date: date.toUTCString(),
								hours_selected: [
									{
										hour: utcHour,
										tableElementIndex: tableElementIndex,
									},
								],
							},
						],
					};

					try {
						const eventRef = doc(firestore, "events", eventId);
						await updateDoc(eventRef, {
							participants: arrayUnion(dataSent),
						});
						queryClient.invalidateQueries("eventData");
						console.log("saved!");
					} catch (e) {
						console.error(e);
						toast.error("Something wrong happend when saving to database");
					}
				}
			} else {
				// we want to delete from firestore
				if (currentParticipant) {
					const eventRef = doc(firestore, "events", eventId);
					let dataSent = {
						...currentParticipant,
						dates_available: [
							...currentParticipant?.dates_available.map((date, i) => {
								return {
									...date,
									hours_selected: date.hours_selected.filter(
										(hour, i) => hour.tableElementIndex !== tableElementIndex
									),
								};
							}),
						],
					};
					dataSent.dates_available = dataSent.dates_available.filter(
						(date) => date.hours_selected.length > 0
					);
					if (dataSent.dates_available.length >= 1) {
						try {
							await updateDoc(eventRef, {
								participants: [
									...eventData.participants.filter(
										(participant) =>
											participant.user_ref.path !== `users/${parsedUser.id}`
									),
									dataSent,
								],
							});
							queryClient.invalidateQueries("eventData");
							// console.log("deleted!");
						} catch (e) {
							console.error(e);
							toast.error("Something went wrong when deleting");
						}
					} else {
						// we want to delete all participant info from this event
						try {
							await updateDoc(eventRef, {
								participants: [
									...eventData.participants.filter(
										(participant) =>
											participant.user_ref.path !== `users/${parsedUser.id}`
									),
								],
							});
							queryClient.invalidateQueries("eventData");
							console.log("participant deleted!");
						} catch (e) {
							console.error(e);
							toast.error("Something went wrong when deleting");
						}
					}
				}
			}
		}
	};

	const { DragSelection } = useSelectionContainer({
		onSelectionChange: () => console.log("selection changed !"),
		selectionProps: {
			style: { display: "none" },
		},
		onSelectionEnd: () => console.log("selection ended"),
		eventsElement: dragRoot,
	});

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
		<>
			<button
				onClick={() => console.log(selectedIndexes)}
				className="bg-gray-800 p-3 mb-4 rounded-md"
			>
				Log selected Indexes
			</button>
			<DragSelection />
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
					{hoursRange?.map((hourObj, tableRowIndex) => {
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
											data-hour={`${hourObj.getHours()}:${hourObj.getMinutes()}`}
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
		</>
	);
}