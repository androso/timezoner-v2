import React, { useEffect, useState } from "react";
import {
	useSelectionContainer,
	boxesIntersect,
	Box,
} from "@air/react-drag-to-select";
import ReactModal from "react-modal";

ReactModal.setAppElement("body");
export default function Page() {
	return (
		<div id="container">
			<Drag />
		</div>
	);
}
const popupDimensions = {
	width: 150,
	height: 226,
};

function Drag() {
	const [selectionBox, setSelectionBox] = React.useState<Box>();
	const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>([]);
	const selectableItems = React.useRef<Box[]>([]);
	const [dragRoot, setDragRoot] = React.useState<HTMLDivElement | null>(null);
	const [showDialog, setShowDialog] = useState(false);
	const close = () => setShowDialog(false);
	const open = () => setShowDialog(true);
	const [lastSelectedBox, setLastSelectedBox] = useState<DOMRect | null>(null);
	const [boxDimensions, setboxDimensions] = useState<{
		width: number;
		height: number;
	} | null>({ width: 100, height: 100 });

	const popupSidePosition: "right" | "left" =
		lastSelectedBox &&
		window.innerWidth - lastSelectedBox.left < popupDimensions.width
			? "left"
			: "right";

	const onSelectionChange = React.useCallback(
		(box: Box) => {
			const indexesToSelect: number[] = [];
			setSelectionBox(box);
			selectableItems.current.forEach((item, index) => {
				if (boxesIntersect(box, item)) {
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
		<div className="container mt-[150%] relative" id="drag">
			{/* <DragSelection /> */}
			<div
				id="elements-container"
				className="max-w-[500px] flex justify-center relative"
				ref={(newRef) => setDragRoot(newRef)}
			>
				{Array.from({ length: 3 }, (_, i) => (
					<div
						key={i}
						data-index={i}
						className={`w-[100px] h-[100px] mr-4 border ${
							selectedIndexes.includes(i) ? "bg-red-700" : ""
						} `}
						onClick={(e) => {
							const $div = e.target as HTMLDivElement;
							setLastSelectedBox($div.getBoundingClientRect());
							setShowDialog(true);
						}}
					/>
				))}
			</div>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
				laboriosam sequi consectetur quibusdam voluptates necessitatibus placeat
				aliquid error sed vitae, aut ipsum? Facilis nam quod atque, doloremque
				officiis accusantium nulla.0
			</p>
			<ReactModal
				isOpen={showDialog}
				contentLabel="Teesting modal lbirary"
				parentSelector={() =>
					document.querySelector("#elements-container") as HTMLDivElement
				}
				className="text-black"
				style={{
					overlay: {
						background: "transparent",
						position: "absolute",
						width: "100%",
					},
					content: {
						width: "150px",
						height: "226px",
						background: "white",
						borderRadius: "5px",
						position: "absolute",
						top: "105%",
						left: 0,
						right: 0,
						marginLeft: "auto",
						marginRight: "auto",
					},
				}}
			>
				<button onClick={close}>Close</button>
				<p>some random text over here</p>
			</ReactModal>
		</div>
	);
}
