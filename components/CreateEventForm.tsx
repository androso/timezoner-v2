import React from "react";

export default function CreateEventForm() {
	return (
		<form className="py-6 px-6 bg-gradient-to-b from-softBlackTransparent to-softBlackTransparent mx-auto rounded-md">
			<h2 className=" font-semibold text-2xl mb-1">Create Event</h2>
			<p className="font-medium text-shadowWhite mb-3">You’ll be able to invite your friends later</p>
			<hr className="bg-[#666666] border-none h-[1px] rounded-sm mb-5" />
			<EventFormFields />
		</form>
	);
}

function EventFormFields() {
	return (
		<>
			<div>
				<label className="block font-medium" htmlFor="event_title">
					Title
				</label>
				<input
					className="w-full bg-deepBlack py-3 px-3 rounded-md border-solid border-[#4e4e4e] border-[1px] placeholder:font-medium "
					type="text"
					name="event_title"
					id="event_title"
					placeholder="Event Title"
				/>
			</div>
			<div>
				<label className="block" htmlFor="event_description">
					Description
				</label>
				<textarea
					className="w-full bg-deepBlack"
					name="event_description"
					id="event_description"
					rows={2}
				></textarea>
			</div>
			<div>
				<label htmlFor="event_timezone" className="block">
					Timezone
				</label>
				<select
					className=" bg-deepBlack"
					name="event_timezone"
					id="event_timezone"
				>
					<option value="">Select Timezone</option>
				</select>
			</div>
			<div>
				<label htmlFor="event_date" className="block">
					Date
				</label>
				<select className=" bg-deepBlack" name="event_date" id="event_date">
					<option className="bg-deepBlack" value="">
						Select a date
					</option>
				</select>
			</div>
			<div className="flex">
				<div>
					<label className="block" htmlFor="date_from">
						From
					</label>
					<select className=" bg-deepBlack">
						<option value="">Start</option>
					</select>
				</div>
				<div>
					<label className="block" htmlFor="date_to">
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
