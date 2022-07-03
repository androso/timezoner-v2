import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import type { dateRange, EventFormValues } from "../lib/utils/types";
import { LightButton } from "./LightButton";
import {
	useForm,
	Controller,
	SubmitHandler,
	FormProvider,
} from "react-hook-form";
import Input, { LoadingInput } from "./Input";
import { Suspense } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { useRouter } from "next/router";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";

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

export default function CreateEventForm() {
	const formMethods = useForm<EventFormValues>({});
	const { parsedUser } = useParsedUserData();
	const router = useRouter();

	const submitForm: SubmitHandler<EventFormValues> = async (data) => {
		const { dateRange, hour_range, description, title, timezone } = data;

		if (parsedUser) {
			const eventDocRef = doc(collection(firestore, "events"));
			const dataSentToFirestore = {
				date_range: {
					start_date: dateRange[0],
					end_date: dateRange[1] ?? dateRange[0],
				},
				hour_range,
				title,
				description: description,
				og_timezone: timezone,
				organizer_ref: doc(firestore, "users", parsedUser.id),
				id: eventDocRef.id,
			};
			await setDoc(eventDocRef, dataSentToFirestore);
			router.push(`/event/${eventDocRef.id}`, undefined, { shallow: true });
		}
	};

	return (
		<FormProvider {...formMethods}>
			<form
				onSubmit={formMethods.handleSubmit(submitForm)}
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
					<Suspense
						fallback={
							<LoadingInput label="Timezone" placeholder="..." required />
						}
					>
						<TimezonesSelect register={formMethods.register} />
					</Suspense>
				</div>
				<div className="mb-2">
					<label htmlFor="event_date" className="block text-lg font-medium">
						Date
					</label>

					<Controller
						name="dateRange"
						control={formMethods.control}
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
				<div className="mb-6">
					<div className="flex ">
						<div>
							<Hourpicker
								label="From"
								placeholder="Start"
								required
								control={formMethods.control}
								name="hour_range.start_hour"
							/>
						</div>
						<div>
							<Hourpicker
								label="To"
								placeholder="End"
								required
								control={formMethods.control}
								name="hour_range.end_hour"
							/>
						</div>
					</div>
					<p
						className={`${
							formMethods.formState.errors.hour_range?.end_hour
								? "visible"
								: "invisible"
						} text-red-500 font-medium text-lg`}
					>
						{formMethods.formState.errors.hour_range?.end_hour?.message}
					</p>
				</div>
				<div className="w-full text-center">
					<LightButton
						innerText="CREATE EVENT"
						css="mx-auto"
						btnType="submit"
					/>
				</div>
			</form>
		</FormProvider>
	);
}
