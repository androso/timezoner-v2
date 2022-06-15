import React, { useState, useMemo } from "react";
import Select from "react-select";
import escapeRegExp from "lodash.escaperegexp";
import { timeZonesNames } from "@vvo/tzdb";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { EventFormValues } from "../lib/utils/types";
import { Control, Controller } from "react-hook-form";

const MAX_DISPLAYED_OPTIONS = 500;

const timezonesOptions = timeZonesNames.map((tz) => ({
	value: tz,
	label: tz.replace(/_/g, " "),
}));

dayjs.extend(utc);
dayjs.extend(timezone);
const userTimezoneDefault = dayjs.tz.guess();
// console.log("user timezone:", userTimezoneDefault);
const defaultValue = {
	label: userTimezoneDefault.replace(/_/g, " "),
	value: userTimezoneDefault,
};

const customStyles = {
	singleValue: (provided: any, state: any) => ({
		...provided,
		color: "#fafafa",
	}),
	input: (provided: any, state: any) => ({
		...provided,
		color: "#fafafa",
	}),
	control: (provided: any, state: any) => ({
		...provided,
		background: "#1a1a1a",
		border: "none",
	}),
	menu: (provided: any, state: any) => ({
		...provided,
		background: "#393d3f",
		zIndex: 2,
	}),
	placeholder: (provided: any, state: any) => ({
		...provided,
		color: "#9E9E9E",
	}),
	option: (provided: any, state: any) => ({
		...provided,
		background: state.isFocused ? "#393d3f" : "#1a1a1a",
	}),
};

export default function TimezonesSelect({
	control,
}: {
	control: Control<EventFormValues, any>;
}) {
	const [inputValue, setInputValue] = useState("");

	const filteredOptions = useMemo(() => {
		if (!inputValue) {
			return timezonesOptions;
		}

		const matchByStart = [];
		const matchByInclusion = [];

		const regByInclusion = new RegExp(escapeRegExp(inputValue), "i");
		const regByStart = new RegExp(`^${escapeRegExp(inputValue)}`, "i");

		for (const timezoneOption of timezonesOptions) {
			if (regByInclusion.test(timezoneOption.label)) {
				if (regByStart.test(timezoneOption.label)) {
					matchByStart.push(timezoneOption);
				} else {
					matchByInclusion.push(timezoneOption);
				}
			}
		}

		return [...matchByStart, ...matchByInclusion];
	}, [inputValue]);

	const slicedOptions = useMemo(() => {
		return filteredOptions.slice(0, MAX_DISPLAYED_OPTIONS);
	}, [filteredOptions]);

	const options = [
		{ value: "America/El_Salvador", label: "America/El Salvador" },
		{ value: "2", label: "Ball" },
		{ value: "3", label: "Cat" },
	];
	const default_value = defaultValue.value;

	return (
		<>
			<Controller
				name="timezone"
				control={control}
				defaultValue={default_value}
				render={({ field }) => {
					return (
						<Select
							{...field}
							options={timezonesOptions}
							value={timezonesOptions.find((c) => c.value === field.value)}
							onChange={(val) => {
								if (val != null) {
									field.onChange(val.value);
								}
							}}
							styles={customStyles}
							className="mb-4"
						/>
					);
				}}
			/>
			<Select
				options={slicedOptions}
				onInputChange={(value) => setInputValue(value)}
				filterOption={() => true}
				styles={customStyles}
				placeholder={"Select Timezone..."}
				defaultValue={{
					label: userTimezoneDefault.replace(/_/g, " "),
					value: userTimezoneDefault,
				}}
			/>
		</>
	);
}
