import Downshift from "downshift";
import { matchSorter } from "match-sorter";
import React from "react";
import { timezonesLabels } from "../lib/timezonesData";
import { useController } from "react-hook-form";

export default function TimezonesSelect({
	defaultTimezone,
	inputCss,
	buttonCss,
	ulCss,
	labelText,
}: {
	defaultTimezone: string;
	inputCss?: string;
	buttonCss?: string;
	ulCss?: string;
	labelText?: string;
}) {
	const controllerProps = {
		name: "timezone",
		defaultValue: defaultTimezone,
		rules: { required: true },
	};
	const { field } = useController(controllerProps);
	return (
		<Downshift
			itemToString={(item) => (item ? item : "")}
			initialSelectedItem={defaultTimezone}
			onSelect={(tz) => field.onChange(tz)}
		>
			{({
				getInputProps,
				getItemProps,
				getLabelProps,
				getMenuProps,
				getToggleButtonProps,
				isOpen,
				inputValue,
				getRootProps,
				highlightedIndex,
			}) => (
				<div className="relative">
					{labelText && (
						<label {...getLabelProps()} className="text-lg block font-medium">
							{labelText}
						</label>
					)}

					<div
						/* 
									// @ts-ignore */
						{...getRootProps({}, { suppressRefError: true })}
						className="flex w-full"
					>
						<input
							{...getInputProps()}
							className={`basic-input-field grow rounded-r-none rounded-br-none border-r-0 w-full ${inputCss}`}
							onBlur={field.onBlur}
							ref={field.ref}
						/>
						<button
							aria-label={"toggle menu"}
							className={`px-3 bg-deepBlack border-solid border-[#4e4e4e] border-[1px] rounded-r-md rounded-br-md ${buttonCss}`}
							type="button"
							{...getToggleButtonProps()}
						>
							{isOpen ? <span>&#8593;</span> : <span>&#8595;</span>}
						</button>
					</div>
					<ul
						{...getMenuProps()}
						className={`${
							isOpen ? "visible" : "invisible"
						} mt-1 max-h-48 w-full overflow-y-scroll absolute z-10 bg-deepBlack border-solid border-[#415d95] border-[1px] ${ulCss}`}
					>
						{isOpen
							? (inputValue != "" && inputValue != null
									? matchSorter(timezonesLabels, inputValue, {
											threshold: matchSorter.rankings.CONTAINS,
									  })
									: timezonesLabels
							  ).map((item, index) => {
									//TODO: The value sent to react-hook-forms should be "America/El_Salvador"
									//TODO: and the value displayed "America/El Salvador"
									return (
										<li
											{...getItemProps({
												key: item,
												index,
												item,
											})}
											className={`px-4 py-3 ${
												highlightedIndex === index ? "bg-[#393d3f]" : null
											}`}
										>
											{item}
										</li>
									);
							  })
							: null}
					</ul>
				</div>
			)}
		</Downshift>
	);
}
