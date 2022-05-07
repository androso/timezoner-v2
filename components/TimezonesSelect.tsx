import React, { useState, useMemo } from "react";
import Select from "react-select";
import escapeRegExp from "lodash/escaperegexp";

import { timeZonesNames } from "@vvo/tzdb";

const MAX_DISPLAYED_OPTIONS = 200;
// !REPLACING: GETING TIMEZONES WITH MOMENT-TIMEZONE

const timezonesOptions = timeZonesNames.map((tz) => ({
	value: tz,
	label: tz.replace(/_/g, ' '),
}));


const customStyles = {
	container: (provided: any, state: any) => ({
		...provided,
		color: "#333",
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
		/>
	);
}
