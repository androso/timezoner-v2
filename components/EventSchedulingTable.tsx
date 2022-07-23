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

type PropsTypes = {
	hoursRange: Date[] | undefined | null;
	datesRange: Date[] | undefined;
	eventData: EventData;
};
export default function EventSchedulingTable({ eventData, hoursRange, datesRange }: PropsTypes) {
	const [dragRoot, setDragRoot] = React.useState<HTMLDivElement | null>(null);
	const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>([]);
	const router = useRouter();
	const { eventId } = router.query;
	const { parsedUser } = useParsedUserData();
	const $table = React.useRef<HTMLTableElement | null>(null);
	const selectableItems = React.useRef<Box[]>([]);
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
	//! PAUSED: sending data to firestore
	const sendToFirestore = async () => {
		const $selectableItems = Array.from(document.getElementsByTagName("td"));
		const $selectedItems = $selectableItems.filter(($item) =>
			selectedIndexes.includes(Number($item.dataset.tableDataIndex))
		);
	};
	const sendIndividualSchedule = async (td: HTMLTableCellElement) => {
		const isSelected = td.classList.contains("selected");
		const elementIndex = td.dataset.tableElementIndex;
		// Send to firestore
		if (isSelected && typeof eventId === "string" && parsedUser) {
			//GUIDE (per click):
			// if user is not in the participants array for this event
			// we add a new participant with the data we received to the participants array
			// else
			// update user's schedule
			// how do we do this?

			const date = new Date(td.dataset.date ?? "");
			const hour = new Date(`${td.dataset.date} ${td.dataset.hour}`);

			const eventRef = doc(firestore, "events", eventId);
			const dataSent = {
				user_ref: doc(firestore, "users", parsedUser?.id),
				dates_available: [
					{
						date,
						hour_range: [hour],
					},
				],
			};

			console.log(dataSent);

			// We copy the array from firestore, we update the local copy, then send the updated array to firestore
			const currentEventParticipants = [...(eventData.participants ?? [])];
			const userParticipantObject = currentEventParticipants.find(
				(participant) => participant.user_ref.path === `users/${parsedUser.id}`
			);
			if (!userParticipantObject) {
				// await updateDoc(eventRef, {
				// 	participants: arrayUnion(dataSent),
				// });
				queryClient.invalidateQueries("eventData");
				console.log("first time we use this event");
			} else {
				console.log("user is already in the participants of this event");
				// update the doc
			}
			// // we find the participant obj whose userref === ours,
			// // we update that object with the received values,
			// // we send to firestore
		}
		// Delete hour from firestore
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

	React.useEffect(() => {
		const timezoneMetadata = timeZones.find(
			(tz) => eventData.og_timezone.replace(" ", "_") === tz.name
		);
		const timezoneToSave = {
			name: timezoneMetadata?.name,
			rawOffsetInMinutes: timezoneMetadata?.rawOffsetInMinutes,
		};
		
	}, []);
	
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
												setSelectedIndexes((prevIndexes) => {
													if (prevIndexes.includes(globalItemIndex)) {
														return prevIndexes.filter(
															(selectedIndex) =>
																selectedIndex !== globalItemIndex
														);
													} else {
														return [...prevIndexes, globalItemIndex];
													}
												});
												sendIndividualSchedule(
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
