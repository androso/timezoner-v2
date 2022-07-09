import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import type { EventFormValues } from "../lib/utils/types";
import { LightButton } from "./LightButton";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { useRouter } from "next/router";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import EventFormFields from "./EventFormFields";

// TODO: abstract form fields into EventFormFields, we should provide this component with action buttons (each one will have its own onclick handler)
// TODO: and also a form context(?)
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
				organizer_id: parsedUser.id,
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
				<EventFormFields formMethods={formMethods} />
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
