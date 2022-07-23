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
import { EventData } from "../lib/utils/types";
import {
	getDatesBetweenRange,
	getHoursBetweenRange,
} from "../lib/utils/client-helpers";
import { queryClient } from "../pages/_app";
import { timeZones } from "../lib/timezonesData";
import toast from "react-hot-toast";

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
	const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>(() => {
		const userParticipantObject = eventData.participants.find(
			(participant) => participant.user_ref.path === `users/${parsedUser?.id}`
		);
		if (userParticipantObject) {
			let hoursSelectedIndexes: number[] = [];
			userParticipantObject.dates_available.forEach((dateObj) => {
				hoursSelectedIndexes = dateObj.hours_selected.map(
					(hourObj) => hourObj.tableElementIndex
				);
			});
			return hoursSelectedIndexes;
		}
		return [];
	});
	const [selectedHours, setSelectedHours] = React.useState();

	//TODO: make this function be called only when the position of the mouse has exceeded a box(?)
	const onSelectionChange = React.useCallback(
		(box: Box) => {
			//! We update the values of the box that we receive, because those are relative to the viewport, not the document
			const boxWithAdjustedPosition = {
				...box,
				left: box.left + window.scrollX + ($table.current?.scrollLeft ?? 0),
				top: box.top + window.scrollY,
			};

			const indexesToSelect: number[] = [];
			selectableItems.current.forEach((item, index) => {
				if (
					boxesIntersect(boxWithAdjustedPosition, item) &&
					selectedIndexes.includes(index) == false
				) {
					indexesToSelect.push(index);
				}
			});
			setSelectedIndexes((prevIndexes) => {
				return Array.from(new Set([...prevIndexes, ...indexesToSelect]));
			});
		},
		[selectableItems, $table]
	);
	//! WORKING ON: sending data to firestore
	const sendToFirestore = async () => {
		const $selectableItems = Array.from(document.getElementsByTagName("td"));
		const $selectedItems = $selectableItems.filter(($item) =>
			selectedIndexes.includes(Number($item.dataset.tableDataIndex))
		);
	};

	const toggleIndividualSchedule = async ($td: HTMLTableCellElement) => {
		const globalItemIndex = Number($td.dataset.tableElementIndex);
		setSelectedIndexes((prevIndexes) => {
			if (prevIndexes.includes(globalItemIndex)) {
				return prevIndexes.filter(
					(selectedIndex) => selectedIndex !== globalItemIndex
				);
			} else {
				return [...prevIndexes, globalItemIndex];
			}
		});

		const isSelecting = $td.classList.contains("selected");
		if (parsedUser && typeof eventId === "string") {
			if (isSelecting) {
				// we want to send to firestore
				const date = new Date($td.dataset.date ?? "");
				const hour = new Date(`${$td.dataset.date} ${$td.dataset.hour}`);
				const utcHour = hour.toUTCString();
				const currentParticipant = eventData.participants.find(
					(participant) => participant.user_ref.id === parsedUser.id
				);
				if (currentParticipant) {
				} else {
					const dataSent = {
						user_ref: doc(firestore, "users", parsedUser?.id ?? ""),
						dates_available: [
							{
								date,
								hours_selected: [
									{
										utcHour,
										tableElementIndex: globalItemIndex,
									},
								],
							},
						],
					};
					try {
						const eventRef = doc(firestore, "events", eventId);
						await updateDoc(eventRef, {
							participants: [dataSent],
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
			}
		}
	};

	const { DragSelection } = useSelectionContainer({
		onSelectionChange,
		selectionProps: {
			style: { display: "none" },
		},
		onSelectionEnd: sendToFirestore,
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
									const globalItemIndex =
										tableRowIndex * datesRange.length + tableDataIndex;
									return (
										<td
											data-table-element-index={globalItemIndex}
											data-date={`${
												date.getMonth() + 1
											}/${date.getDate()}/${date.getFullYear()}`}
											data-hour={`${hourObj.getHours()}:${hourObj.getMinutes()}`}
											className={`px-6 py-4 ${
												selectedIndexes.includes(globalItemIndex)
													? "bg-green-600"
													: "bg-tdBgColor selected"
											} ${
												tableRowIndex === hoursRange.length - 1
													? "last:rounded-br-xl first:rounded-bl-xl"
													: ""
											}`}
											key={tableDataIndex}
											onClick={(e) => {
												toggleIndividualSchedule(
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

// const sendIndividualSchedule = async (td: HTMLTableCellElement) => {
// 	const isSelected = td.classList.contains("selected");
// 	const elementIndex = Number(td.dataset.tableElementIndex);
// 	if (typeof eventId === "string" && parsedUser) {
// 		const eventRef = doc(firestore, "events", eventId);
// 		const currentEventParticipants = [...(eventData.participants ?? [])];
// 		const userParticipantObject = currentEventParticipants.find(
// 			(participant) => participant.user_ref.path === `users/${parsedUser.id}`
// 		);

// 		if (isSelected) {
// 			const date = new Date(td.dataset.date ?? "");
// 			const hour = new Date(`${td.dataset.date} ${td.dataset.hour}`);
// 			const utcHour = hour.toUTCString();

// 			if (!userParticipantObject) {
// 				const dataSent = {
// 					user_ref: doc(firestore, "users", parsedUser?.id),
// 					dates_available: [
// 						{
// 							date,
// 							hours_selected: [
// 								{ hour: utcHour, tableElementIndex: elementIndex },
// 							],
// 						},
// 					],
// 				};

// 				await updateDoc(eventRef, {
// 					participants: arrayUnion(dataSent),
// 				});
// 				queryClient.invalidateQueries("eventData");
// 				console.log("first time we use this event");
// 			} else {
// 			}
// 		} else {
// 			// Delete hour from firestore
// 			const date = new Date(td.dataset.date ?? "");
// 			const hour = new Date(`${td.dataset.date} ${td.dataset.hour}`);
// 			const utcHour = hour.toUTCString();
// 			if (
// 				userParticipantObject?.dates_available.length === 1 &&
// 				userParticipantObject.dates_available[0].hours_selected.length === 1
// 			) {
// 				// deleting the only hour selected overall
// 				try {
// 					await updateDoc(eventRef, {
// 						participants: [],
// 					});
// 					queryClient.invalidateQueries("eventData");
// 					console.log("deleted succesfully!");
// 				} catch (e) {
// 					toast.error("There was an error while selecting hours :(");
// 				}
// 			}
// 		}
// 	}
// };
