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
	const [dragRoot, setDragRoot] = React.useState<HTMLDivElement | null>(null);
	const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>([]);
	const selectableItems = React.useRef<Box[]>([]);

	const onSelectionChange = React.useCallback(
		(box: Box) => {
			const indexesToSelect: number[] = [];

			selectableItems.current.forEach((item, index) => {
				if (boxesIntersect(box, item)) {
					indexesToSelect.push(index);
				}
			});
			setSelectedIndexes(indexesToSelect);
		},
		[selectableItems]
	);

	React.useEffect(() => {
		// console.log(selectedIndexes);
	}, [selectedIndexes]);
	const { DragSelection } = useSelectionContainer({
		onSelectionChange,
		selectionProps: {
			style: {},
		},
		eventsElement: dragRoot,
	});

	React.useEffect(() => {
		if (dragRoot) {
			const allBoxes = [];
			Array.from(dragRoot.children).forEach((tableRow) => {
				Array.from(tableRow.children).forEach((tableData) => {
					const { left, top, width, height } =
						tableData.getBoundingClientRect();
					selectableItems.current.push({
						left,
						top,
						width,
						height,
					});
				});
			});
		}
	}, [dragRoot]);

	return (
		<>
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
									return (
										<td
											className={`border-yellow-400 border-2 h-[60px] ${
												selectedIndexes.includes(
													tableRowIndex * datesRange.length + tableDataIndex
												)
													? "bg-green-600"
													: null
											}`}
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
		</>
	);
}
