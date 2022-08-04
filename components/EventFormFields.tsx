import dynamic from "next/dynamic";
import { Controller, UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../lib/utils/types";
import Input, { LoadingInput } from "./Input";
import "react-datepicker/dist/react-datepicker.css";
import { defaultTimezone as localTimezone } from "../lib/timezonesData";
// import TimezonesSelect from "./TimezonesSelect";

const DatePicker = dynamic(() => import("react-datepicker"), {
	ssr: false,
	loading: () => (
		<input
			type="text"
			className="basic-input-field w-full placeholder:text-shadowWhite2 mr-4"
			placeholder="Select Date..."
		></input>
	),
});

const Hourpicker = dynamic(() => import("./Hourpicker"), {
	ssr: false,
	loading: () => (
		<input
			type="text"
			className="basic-input-field mt-6 placeholder:text-shadowWhite2 w-[120px]"
			placeholder="Hour"
		></input>
	),
});

const TimezonesSelect = dynamic(() => import("./TimezonesSelect"), {
	ssr: false,
	loading: () => <LoadingInput label="Timezone" placeholder="..." required />,
});
export default function EventFormFields({
	formMethods,
	defaultTimezone,
}: {
	formMethods: UseFormReturn<EventFormValues, object>;
	defaultTimezone?: string;
}) {
	return (
		<>
			<div className="mb-4">
				<Input
					placeholder="Event Title"
					label="Title"
					required
					register={formMethods.register}
					name="title"
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
					id="event_description"
					rows={2}
					placeholder="Add a description..."
					required
					{...formMethods.register("description", { required: true })}
				></textarea>
			</div>
			<div className="mb-2">
				<TimezonesSelect
					defaultTimezone={defaultTimezone ?? localTimezone.label}
					labelText="Timezone"
				/>
			</div>
			<div className="mb-2">
				<label htmlFor="event_date" className="block text-lg font-medium">
					Date
				</label>

				<Controller
					name="date"
					control={formMethods.control}
					defaultValue={null as unknown as Date}
					render={({ field }) => {
						const startingDate = field.value;
						return (
							<DatePicker
								selected={startingDate}
								onChange={field.onChange}
								startDate={startingDate}
								className="basic-input-field w-full placeholder:text-shadowWhite2"
								onBlur={field.onBlur}
								name={field.name}
								wrapperClassName="datepicker"
								dateFormat="MMMM d"
								placeholderText="Select Date..."
								required
							/>
						);
					}}
				/>
			</div>
			<div className="mb-6">
				<div className="flex ">
					<div>
						<Hourpicker
							label="From"
							placeholder="Start"
							required
							control={formMethods.control}
							name="hours_range.start_hour"
						/>
					</div>
					<div>
						<Hourpicker
							label="To"
							placeholder="End"
							required
							control={formMethods.control}
							name="hours_range.end_hour"
						/>
					</div>
				</div>
				<p
					className={`${
						formMethods.formState.errors.hours_range?.end_hour
							? "visible"
							: "invisible"
					} text-red-500 font-medium text-lg`}
				>
					{formMethods.formState.errors.hours_range?.end_hour?.message}
				</p>
			</div>
		</>
	);
}
