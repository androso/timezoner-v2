import React from "react";
import {
	useSelectionContainer,
	boxesIntersect,
	Box,
} from "@air/react-drag-to-select";

type PropsTypes = {
	hoursRange: Date[] | undefined;
	datesRange: Date[] | undefined;
};
export default function EventSchedulingTable({
	hoursRange,
	datesRange,
}: PropsTypes) {
	const [dragRoot, setDragRoot] = React.useState<HTMLDivElement | null>(null);
	const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>([]);
	// const [tableScrollLeft, setTableScrollLeft] = React.useState();
	const $table = React.useRef<HTMLTableElement | null>(null);
	const selectableItems = React.useRef<Box[]>([]);

	//TODO: make this function be called only when the position of the mouse has exceeded a box(?)
	const onSelectionChange = React.useCallback(
		(box: Box) => {
			//! We update the values of the box that we receive, because those are relative to the viewport, not the document
			//TODO: Is there a way to make this work with values relative to the viewport?
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

	const { DragSelection } = useSelectionContainer({
		onSelectionChange,
		selectionProps: {
			style: { display: "none" },
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
											className={`px-6 py-4 ${
												selectedIndexes.includes(globalItemIndex)
													? "bg-green-600"
													: "bg-tdBgColor"
											} ${
												tableRowIndex === hoursRange.length - 1
													? "last:rounded-br-xl first:rounded-bl-xl"
													: ""
											}`}
											key={tableDataIndex}
											onClick={() => {
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
