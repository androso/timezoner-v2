import React from "react";
import {
	useSelectionContainer,
	boxesIntersect,
	Box,
} from "@air/react-drag-to-select";

//! Working on: Drag and select functionality to choose hours
type PropsTypes = {
	hoursRange: Date[] | undefined;
	datesRange: Date[] | undefined;
};
export default function EventAvailabalityTable({
	hoursRange,
	datesRange,
}: PropsTypes) {
	//! Working on: being able to select more than once
	const [dragRoot, setDragRoot] = React.useState<HTMLDivElement | null>(null);
	const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>([]);

	const selectableItems = React.useRef<Box[]>([]);
	const onSelectionChange = React.useCallback(
		(box: Box) => {
			const indexesToSelect: number[] = [];
			//! We update the values of the box that we receive, because those are relative to the viewport, not the document
			//TODO: Is there a way to make this work with values relative to the viewport?
			const boxWithAdjustedPosition = {
				...box,
				left: box.left + window.scrollX,
				top: box.top + window.scrollY,
			};
			selectableItems.current.forEach((item, index) => {
				if (boxesIntersect(boxWithAdjustedPosition, item)) {
					indexesToSelect.push(index);
					// console.log(index);
				}
			});

			// setSelectedIndexes((prevIndexes) => [...prevIndexes, ...indexesToSelect]);
			setSelectedIndexes(indexesToSelect);
		},
		[selectableItems]
	);

	const { DragSelection } = useSelectionContainer({
		onSelectionChange,
		selectionProps: {
			style: {},
		},
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
			<table>
				<thead>
					<tr>
						{datesRange &&
							datesRange.map((date, index) => (
								<th className="border-2 border-red-500" key={index}>
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
							<tr className="border-2 border-yellow-400" key={tableRowIndex}>
								{datesRange?.map((date, tableDataIndex) => {
									// The index relative to how far from the first item we are.
									const globalItemIndex =
										tableRowIndex * datesRange.length + tableDataIndex;
									return (
										<td
											className={`border-yellow-400 border-2 ${
												selectedIndexes.includes(globalItemIndex)
													? "bg-green-600"
													: null
											}`}
											key={tableDataIndex}
											onClick={() => {
												setSelectedIndexes((prevIndexes) => {
													if (prevIndexes.includes(globalItemIndex)) {
														return prevIndexes.filter(
															(selectedIndex) => selectedIndex !== globalItemIndex
														);
													} else {
														return [...prevIndexes, globalItemIndex];
													}
												});
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
