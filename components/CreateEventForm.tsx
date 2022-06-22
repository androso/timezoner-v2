import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import type { dateRange, EventFormValues } from "../lib/utils/types";
import { LightButton } from "./LightButton";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { defaultTimezone, timezonesLabels } from "../lib/timezonesData";
import { matchSorter } from "match-sorter";
import Input from "./Input";
import Downshift from "downshift";

const DatePicker = dynamic(() => import("react-datepicker"), {
	ssr: false,
	loading: () => (
		<input
			type="text"
			className="basic-input-field w-full placeholder:text-shadowWhite2"
			placeholder="Select Date..."
		></input>
	),
});

const Hourpicker = dynamic(() => import("./Hourpicker"), {
	ssr: false,
	loading: () => (
		<input
			type="text"
			className="basic-input-field placeholder:text-shadowWhite2 w-[120px]"
			placeholder="Hour"
		></input>
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
			autoComplete="off"
		>
			<h2 className=" font-semibold text-2xl mb-1">Create Event</h2>
			<p className="font-medium text-shadowWhite mb-3">
				You'll be able to invite your friends later
			</p>
			<hr className="bg-[#666666] border-none h-[1px] rounded-sm mb-5" />
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
					{...register("description", { required: true })}
				></textarea>
			</div>
			<div className="mb-2">
				{/* <DynamicTimezonesSelect /> */}
				<Downshift
					itemToString={(item) => (item ? item : "")}
					initialSelectedItem={defaultTimezone.label}
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
						return (
							<DatePicker
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
					<Hourpicker
						label="From"
						placeholder="Start"
						required
						control={control}
						name="startHour"
					/>
				</div>
				<div>
					<Hourpicker
						label="To"
						placeholder="End"
						required
						control={control}
						name="endHour"
					/>
				</div>
			</div>
			<div className="w-full text-center">
				<LightButton innerText="CREATE EVENT" css="mx-auto" btnType="submit" />
			</div>
		</form>
	);
}
