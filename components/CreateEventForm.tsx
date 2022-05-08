// import dynamic from "next/dynamic";

// const DynamicTimezonesSelect = dynamic(() => import("./TimezonesSelect"), {
// 	ssr: false,
// });

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

				{/* <DynamicTimezonesSelect /> */}
				{/* <option value="">Select Timezone</option> */}
				{/* <select
					className=" bg-deepBlack"
					name="event_timezone"
					id="event_timezone"
				>
					{allTimezonesNames.map((timezone) => {
						return <option value={timezone}>{timezone}</option>	
					})}
					
				</select> */}
			</div>
			<div>
				<label htmlFor="event_date" className="block text-lg font-medium">
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
