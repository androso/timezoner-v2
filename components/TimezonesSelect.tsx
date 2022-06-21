//! rewriting react-select with downshift
import React, { useState, useMemo, useEffect } from "react";
// import Select from "react-select";
// import escapeRegExp from "lodash.escaperegexp";
import { timeZonesNames } from "@vvo/tzdb";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
// import { EventFormValues } from "../lib/utils/types";
// import { Control, Controller } from "react-hook-form";

import Downshift from "downshift";
import { matchSorter } from "match-sorter";

const MAX_DISPLAYED_OPTIONS = 500;

const timezonesOptions = timeZonesNames.map((tz) => ({
	value: tz,
	label: tz.replace(/_/g, " "),
}));

const timezonesLabels = timezonesOptions.map((tz) => tz.label);
dayjs.extend(utc);
dayjs.extend(timezone);
const userTimezoneDefault = dayjs.tz.guess();

const defaultValue = {
	label: userTimezoneDefault.replace(/_/g, " "),
	value: userTimezoneDefault,
};

export default function TimezonesSelect() {
	return (
		<Downshift
			itemToString={(item) => (item ? item : "")}
			initialSelectedItem={defaultValue.label}
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
					<label {...getLabelProps()} className="text-lg">
						Timezone
					</label>

					<div
						/*
      					// @ts-ignore */
						{...getRootProps({}, { suppressRefError: true })}
						className="flex"
					>
						<input
							{...getInputProps()}
							className="basic-input-field grow rounded-r-none rounded-br-none border-r-0"
						/>
						<button
							aria-label={"toggle menu"}
							className="px-3 bg-deepBlack border-solid border-[#4e4e4e] border-[1px] rounded-r-md rounded-br-md"
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
						} mt-1 max-h-48 w-full overflow-y-scroll absolute z-10 bg-deepBlack border-solid border-[#415d95] border-[1px]`}
					>
						{isOpen
							? (inputValue != "" && inputValue != null
									? matchSorter(timezonesLabels, inputValue, {
											threshold: matchSorter.rankings.CONTAINS,
									  })
									: timezonesLabels
							  ).map((item, index) => {
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

// const customStyles = {
// 	singleValue: (provided: any, state: any) => ({
// 		...provided,
// 		color: "#fafafa",
// 	}),
// 	input: (provided: any, state: any) => ({
// 		...provided,
// 		color: "#fafafa",
// 	}),
// 	control: (provided: any, state: any) => ({
// 		...provided,
// 		background: "#1a1a1a",
// 		border: "none",
// 	}),
// 	menu: (provided: any, state: any) => ({
// 		...provided,
// 		background: "#393d3f",
// 		zIndex: 2,
// 	}),
// 	placeholder: (provided: any, state: any) => ({
// 		...provided,
// 		color: "#9E9E9E",
// 	}),
// 	option: (provided: any, state: any) => ({
// 		...provided,
// 		background: state.isFocused ? "#393d3f" : "#1a1a1a",
// 	}),
// };

// export default function TimezonesSelect({
// 	control,
// }: {
// 	control: Control<EventFormValues, any>;
// }) {
// 	const [inputValue, setInputValue] = useState("");

// 	const filteredOptions = useMemo(() => {
// 		if (!inputValue) {
// 			return timezonesOptions;
// 		}

// 		const matchByStart = [];
// 		const matchByInclusion = [];

// 		const regByInclusion = new RegExp(escapeRegExp(inputValue), "i");
// 		const regByStart = new RegExp(`^${escapeRegExp(inputValue)}`, "i");

// 		for (const timezoneOption of timezonesOptions) {
// 			if (regByInclusion.test(timezoneOption.label)) {
// 				if (regByStart.test(timezoneOption.label)) {
// 					matchByStart.push(timezoneOption);
// 				} else {
// 					matchByInclusion.push(timezoneOption);
// 				}
// 			}
// 		}

// 		return [...matchByStart, ...matchByInclusion];
// 	}, [inputValue]);

// 	const slicedOptions = useMemo(() => {
// 		return filteredOptions.slice(0, MAX_DISPLAYED_OPTIONS);
// 	}, [filteredOptions]);

// 	const options = [
// 		{ value: "America/El_Salvador", label: "America/El Salvador" },
// 		{ value: "2", label: "Ball" },
// 		{ value: "3", label: "Cat" },
// 	];
// 	const default_value = defaultValue.value;

// 	return (
// 		<>
// 			{/* DEFAULT SELECT FROM REACT-SELECT */}
// 			<Controller
// 				name="timezone"
// 				control={control}
// 				defaultValue={default_value}
// 				render={({ field }) => {
// 					return (
// 						<Select
// 							{...field}
// 							options={timezonesOptions}
// 							value={timezonesOptions.find((c) => c.value === field.value)}
// 							onChange={(val) => {
// 								if (val != null) {
// 									field.onChange(val.value);
// 								}
// 							}}
// 							styles={customStyles}
// 							className="mb-4"
// 						/>
// 					);
// 				}}
// 			/>

// 			{/* CUSTOM SELECT, "smoother" */}
// 			{/* <Select
// 				options={slicedOptions}
// 				onInputChange={(value) => setInputValue(value)}
// 				filterOption={() => true}
// 				styles={customStyles}
// 				placeholder={"Select Timezone..."}
// 				defaultValue={{
// 					label: userTimezoneDefault.replace(/_/g, " "),
// 					value: userTimezoneDefault,
// 				}}
// 			/> */}
// 		</>
// 	);
// }
