import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useState } from "react";
import { dateRange } from "../lib/utils/types";

const DynamicTimezonesSelect = dynamic(() => import("./TimezonesSelect"), {
	ssr: false,
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
	const [startDate, setstartDate] = useState<null | Date>(new Date());
	const [endDate, setEndDate] = useState<null | Date>(null);
	const updateDateRange = (dates: dateRange) => {
		if (dates != null) {
			const [start, end] = dates;
			setstartDate(start);
			setEndDate(end);
		}
	};

	return (
		<>
			<div className="mb-4">
				<label className="block font-medium text-lg" htmlFor="event_title">
					Title
				</label>
				<input
					className="w-full basic-input-field "
					type="text"
					name="event_title"
					id="event_title"
					placeholder="Event Title"
					autoComplete="off"
				/>
			</div>
			<div>
				<label
					className="block font-medium text-lg"
					htmlFor="event_description"
				>
					Description
				</label>
				<textarea
					className="w-full bg-deepBlack basic-input-field"
					name="event_description"
					id="event_description"
					rows={2}
					placeholder="Add a description..."
				></textarea>
			</div>
			<div>
				<label htmlFor="event_timezone" className="block text-lg">
					Timezone
				</label>
				<DynamicTimezonesSelect />
			</div>
			<div>
				<label htmlFor="event_date" className="block text-lg font-medium">
					Date
				</label>
				<DatePicker
					selected={startDate}
					onChange={updateDateRange}
					{...{ startDate, endDate }}
					selectsRange
					className="basic-input-field"
					wrapperClassName="datepicker"
				/>
			</div>
			<div className="flex">
				<div>
					<label className="block text-lg font-medium" htmlFor="date_from">
						From
					</label>
					<select className=" bg-deepBlack">
						<option value="">Start</option>
					</select>
				</div>
				<div>
					<label className="block text-lg font-medium" htmlFor="date_to">
						To
					</label>
					<select className=" bg-deepBlack">
						<option value="">End</option>
					</select>
				</div>
			</div>
		</>
	);
}
