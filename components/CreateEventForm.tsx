import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import type { dateRange, EventFormValues } from "../lib/utils/types";
import { LightButton } from "./LightButton";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Input, { LoadingInput } from "./Input";
import { Suspense } from "react";
import { useAuth } from "../lib/context";

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
	suspense: true,
});

//TODO: don't allow user to add a endHour earlier than startHour
export default function CreateEventForm() {
	const { register, handleSubmit, control } = useForm<EventFormValues>();
	const { user } = useAuth();
	const submitForm: SubmitHandler<EventFormValues> = (data) => {
		const { dateRange, startHour, endHour, description, eventTitle, timezone } =
			data;
		const dataSentToFirestore = {
			date_range: {
				start_date: dateRange[0],
				end_date: dateRange[1],
			},
			hour_range: {
				start_hour: startHour,
				end_hour: endHour,
			},
			title: eventTitle,
			description: description,
			og_timezone: timezone,
			organizer_id: user?.uid,
		};
		console.log(dataSentToFirestore);
	};

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
				<Suspense
					fallback={
						<LoadingInput label="Timezone" placeholder="..." required />
					}
				>
					<TimezonesSelect register={register} />
				</Suspense>
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
