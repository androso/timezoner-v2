import React, { useState, useMemo } from "react";
import Select from "react-select";
import escapeRegExp from "lodash/escaperegexp";
import { timeZonesNames } from "@vvo/tzdb";

const MAX_DISPLAYED_OPTIONS = 500;

const timezonesOptions = timeZonesNames.map((tz) => ({
	value: tz,
	label: tz.replace(/_/g, " "),
}));

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
	}),
	placeholder: (provided: any, state: any) => ({
		...provided,
		color: "#C1BDBD",
	}),
	option: (provided: any, state: any) => ({
		...provided,
		background: state.isFocused ? "#393d3f" : "#1a1a1a",
	}),
};

export default function TimezonesSelect() {
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

	return (
		<Select
			options={slicedOptions}
			onInputChange={(value) => setInputValue(value)}
			filterOption={() => true}
			styles={customStyles}
			placeholder={"Select Timezone..."}
		/>
	);
}
