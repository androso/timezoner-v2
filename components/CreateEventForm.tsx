import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import {
	dateRange,
	HourPickerProps,
	inputProps,
	EventFormValues,
} from "../lib/utils/types";
import { LightButton } from "./LightButton";
import {
	useForm,
	Controller,
	SubmitHandler,
	UseFormRegister,
	Control,
	useController,
	UseControllerProps,
} from "react-hook-form";

const DynamicTimezonesSelect = dynamic(() => import("./TimezonesSelect"), {
	ssr: false,
	loading: () => (
		<select className="basic-input-field w-full h-[38px]"></select>
	),
});
const DatePicker = dynamic(() => import("react-datepicker"), {
	ssr: false,
	loading: () => (
		<input type="text" className="basic-input-field w-full"></input>
	),
});

export default function CreateEventForm() {
	const { register, handleSubmit, control } = useForm<EventFormValues>();
	const submitForm: SubmitHandler<EventFormValues> = (data) =>
		console.log(data);

	return (
		<form
			onSubmit={handleSubmit(submitForm)}
			className="py-6 px-6 bg-gradient-to-b from-softBlackTransparent to-softBlackTransparent mx-auto rounded-md max-w-lg"
		>
			<h2 className=" font-semibold text-2xl mb-1">Create Event</h2>
			<p className="font-medium text-shadowWhite mb-3">
				You’ll be able to invite your friends later
			</p>
			<hr className="bg-[#666666] border-none h-[1px] rounded-sm mb-5" />
			<EventFormFields {...{ register, control }} />
		</form>
	);
}

function EventFormFields({
	register,
	control,
}: {
	register: UseFormRegister<EventFormValues>;
	control: Control<EventFormValues, any>;
}) {
	return (
		<>
			<div className="mb-4">
				<Input
					placeholder="Event Title"
					label="Title"
					required
					register={register}
					name="eventTitle"
				/>
			</div>
			<div className="mb-2">
				<TextArea
					label="Description"
					placeholder="Add a description..."
					required
					register={register}
					name="description"
				/>
			</div>
			<div className="mb-2">
				<label htmlFor="event_timezone" className="block text-lg">
					Timezone
				</label>
				<DynamicTimezonesSelect control={control} />
			</div>
			<div className="mb-2">
				<label htmlFor="event_date" className="block text-lg font-medium">
					Date
				</label>

				<Controller
					name="dateRange"
					control={control}
					defaultValue={[null, null]}
					render={({ field }) => {
						const [startingDate, endingDate] = field.value;
						const { ref } = field;
						//TODO find a reason to why Datepicker doens't accept the field object with field.value inside when doing {...field} in Datepicker props
						const fieldObjectWithoutValue = {
							name: field.name,
							ref,
							onChange: field.onChange,
							onBlur: field.onBlur,
						};
						return (
							<DatePicker
								{...fieldObjectWithoutValue}
								selected={startingDate}
								onChange={(dates: dateRange) => {
									field.onChange(dates);
								}}
								selectsRange
								startDate={startingDate}
								endDate={endingDate}
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
			<div className="flex mb-6">
				<div>
					<HourPicker
						label="From"
						placeholder="Start"
						required
						control={control}
						name="startHour"
					/>
				</div>
				<div>
					<HourPicker
						label="To"
						placeholder="End"
						required
						control={control}
						name="endHour"
					/>
				</div>
			</div>
			<div className="w-full text-center">
				<LightButton
					innerText="CREATE EVENT"
					css="mx-auto"
					btnType="submit"
				/>
			</div>
		</>
	);
}

function Input({ label, placeholder, required, register, name }: inputProps) {
	return (
		<>
			<label className="block font-medium text-lg" htmlFor="event_title">
				{label}
			</label>
			<input
				className="w-full basic-input-field placeholder:text-shadowWhite2"
				type="text"
				id="event_title"
				placeholder={placeholder}
				autoComplete="off"
				required={required ? true : false}
				{...register(name, { required })}
			/>
		</>
	);
}

function TextArea({
	label,
	placeholder,
	required,
	register,
	name,
}: inputProps) {
	return (
		<>
			<label className="block font-medium text-lg" htmlFor="event_description">
				{label}
			</label>
			<textarea
				className="w-full bg-deepBlack basic-input-field placeholder:text-shadowWhite2"
				id="event_description"
				rows={2}
				{...{ required, placeholder }}
				{...register(name, { required })}
			></textarea>
		</>
	);
}
function HourPicker({
	label,
	placeholder,
	required,
	control,
	name,
}: HourPickerProps) {
	const ControllerProps = {
		control,
		name,
		defaultValue: undefined,
	};
	const {
		field: { onBlur, onChange, value, ref },
	} = useController(ControllerProps);

	return (
		<>
			<label className="block text-lg font-medium" htmlFor="date_from">
				{label}
			</label>
			<DatePicker
				{...{ name, onBlur, onChange, ref, required }}
				selected={value}
				showTimeSelect
				showTimeSelectOnly
				timeIntervals={30}
				timeCaption="Time"
				dateFormat="h:mm aa"
				className="basic-input-field max-w-[120px] placeholder:text-shadowWhite2 mr-4"
				placeholderText={placeholder}
			/>
		</>
	);
}
