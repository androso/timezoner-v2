import React, { useRef } from "react";
import {
	useSelectionContainer,
	boxesIntersect,
	Box,
} from "@air/react-drag-to-select";

export default function Drag() {
	const [selectionBox, setSelectionBox] = React.useState<Box>();
	const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>([]);
	const selectableItems = React.useRef<Box[]>([]);
	const [dragRoot, setDragRoot] = React.useState<HTMLDivElement | null>(null);

	const onSelectionChange = React.useCallback(
		(box: Box) => {
			const indexesToSelect: number[] = [];

			selectableItems.current.forEach((item, index) => {
				if (boxesIntersect(box, item)) {
					console.log("boxes intersect!");
					indexesToSelect.push(index);
				}
			});
			setSelectedIndexes(indexesToSelect);
		},
		[selectableItems]
	);

	const { DragSelection } = useSelectionContainer({
		onSelectionChange,
		eventsElement: dragRoot,
		selectionProps: {
			style: {},
		},
	});

	React.useEffect(() => {
		if (dragRoot) {
			Array.from(dragRoot.children).forEach((item) => {
				const { left, top, width, height } = item.getBoundingClientRect();
				selectableItems.current.push({
					left,
					top,
					width,
					height,
				});
			});
		}
	}, [dragRoot]);

	return (
		<div className="container mt-3 relative" id="drag">
			<DragSelection />
			<div
				id="elements-container"
				className="grid grid-cols-4 max-w-[500px]"
				ref={(newRef) => setDragRoot(newRef)}
			>
				{Array.from({ length: 16 }, (_, i) => (
					<div
						key={i}
						data-index={i}
						className={`w-[100px] h-[100px] border ${
							selectedIndexes.includes(i) ? "bg-red-700" : ""
						} `}
					/>
				))}
			</div>
		</div>
	);
}
