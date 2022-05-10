import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";

import { useState } from "react";
import { dateRange } from "../lib/utils/types";
import LightButton from "./LightButton";

const DynamicTimezonesSelect = dynamic(() => import("./TimezonesSelect"), {
	ssr: false,
	loading: () => (
		<select className="basic-input-field w-full h-[38px]"></select>
	),
});

const DatePicker = dynamic(() => import("react-datepicker"), {
	ssr: false,
	loading: () => <input type="text" className="basic-input-field"></input>,
});

export default function CreateEventForm() {
	return (
		<form className="py-6 px-6 bg-gradient-to-b from-softBlackTransparent to-softBlackTransparent mx-auto rounded-md max-w-lg">
			<h2 className=" font-semibold text-2xl mb-1">Create Event</h2>
			<p className="font-medium text-shadowWhite mb-3">
				You’ll be able to invite your friends later
			</p>
			<hr className="bg-[#666666] border-none h-[1px] rounded-sm mb-5" />
			<EventFormFields />
		</form>
	);
}

function EventFormFields() {
	const [startDate, setstartDate] = useState<null | Date>(null);
	const [endDate, setEndDate] = useState<null | Date>(null);
	const [startHour, setStartHour] = useState<null | Date>();
	const [endHour, setEndHour] = useState<null | Date>(null);

	const updateDateRange = (dates: dateRange) => {
		if (dates != null) {
			const [start, end] = dates;
			setstartDate(start);
			setEndDate(end);
		}
	};

	const updateStartHour = (date: unknown) => {
		if (date instanceof Date) {
			setStartHour(date);
		}
	};

	const updateEndHour = (date: unknown) => {
		if (date instanceof Date) {
			console.log(date);
			setEndHour(date);
		}
	};
	return (
		<>
			<div className="mb-4">
				<label className="block font-medium text-lg" htmlFor="event_title">
					Title
				</label>
				<input
					className="w-full basic-input-field placeholder:text-shadowWhite2"
					type="text"
					name="event_title"
					id="event_title"
					placeholder="Event Title"
					autoComplete="off"
					required
				/>
			</div>
			<div className="mb-2">
				<label
					className="block font-medium text-lg"
					htmlFor="event_description"
				>
					Description
				</label>
				<textarea
					className="w-full bg-deepBlack basic-input-field placeholder:text-shadowWhite2"
					name="event_description"
					id="event_description"
					rows={2}
					placeholder="Add a description..."
				></textarea>
			</div>
			<div className="mb-2">
				<label htmlFor="event_timezone" className="block text-lg">
					Timezone
				</label>
				<DynamicTimezonesSelect />
			</div>
			<div className="mb-2">
				<label htmlFor="event_date" className="block text-lg font-medium">
					Date
				</label>
				<DatePicker
					selected={startDate}
					onChange={updateDateRange}
					{...{ startDate, endDate }}
					selectsRange
					className="basic-input-field w-full placeholder:text-shadowWhite2"
					wrapperClassName="datepicker"
					dateFormat="MMMM d"
					placeholderText="Select Date..."
				/>
			</div>
			<div className="flex mb-6">
				<div>
					<label className="block text-lg font-medium" htmlFor="date_from">
						From
					</label>
					<DatePicker
						selected={startHour}
						onChange={updateStartHour}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={30}
						timeCaption="Time"
						dateFormat="h:mm aa"
						className="basic-input-field max-w-[120px] placeholder:text-shadowWhite2 mr-4"
						placeholderText="Start"
					/>
				</div>
				<div>
					<label className="block text-lg font-medium" htmlFor="date_to">
						To
					</label>
					<DatePicker
						selected={endHour}
						onChange={updateEndHour}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={30}
						timeCaption="Time"
						dateFormat="h:mm aa"
						className="basic-input-field max-w-[120px] placeholder:text-shadowWhite2 z-10"
						placeholderText="End"
					/>
				</div>
			</div>
			<div className="w-full text-center">
				<LightButton
					innerText="CREATE EVENT"
					className="mx-auto"
					btnType="submit"
				/>
			</div>
		</>
	);
}
