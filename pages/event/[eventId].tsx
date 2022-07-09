import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useEventData from "../../lib/utils/hooks/useEventData";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import LoadingSpinner from "../../components/LoadingSpinner";
import { EventData, EventFormValues } from "../../lib/utils/types";
import EventAvailabalityTable from "../../components/EventAvailabalityTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import { LightButton } from "../../components/LightButton";
import EventFormFields from "../../components/EventFormFields";

export default function EventId() {
	const { eventData, status: eventStatus, error: eventError } = useEventData();
	const { parsedUser } = useParsedUserData();
	//TODO:
	//!ERROR: why eventstatus can be success but have no eventdata or parseduser?

	if (eventStatus === "success" && parsedUser && eventData) {
		// console.log("we have succeded!");
		if (parsedUser?.id === eventData?.organizer_data.id) {
			return <OrganizerOverview eventData={eventData} />;
		} else {
			return <ParticipantOverview eventData={eventData} />;
		}
	}

	return (
		<ProtectedRoute>
			{eventStatus === "success" && !parsedUser && !eventData && (
				<LoadingOverview />
			)}
			{eventStatus === "loading" && <LoadingOverview />}
			{eventStatus === "error" &&
				(eventError instanceof Error ? (
					<Container css="pt-8">
						<HomeBreadcrumbs currentPage="Event" />
						<pre>{eventError.message}</pre>
					</Container>
				) : (
					<Container css="pt-8">
						<HomeBreadcrumbs currentPage="Event" />
						<p className="text-yellow-400">
							Sorry, something went wrong with your request, try reloading the
							page
						</p>
					</Container>
				))}
		</ProtectedRoute>
	);
}

function OrganizerOverview({
	eventData,
}: {
	eventData: EventData | undefined;
}) {
	//TODO: replace this implementation with ReachUI/dialog
	const router = useRouter();
	const { eventId } = router.query;
	//!WORKING ON : adding default values to this form
	React.useEffect(() => {
		console.log(eventData?.og_timezone);
	}, [eventData]);
	const formMethods = useForm<EventFormValues>({
		defaultValues: {
			title: eventData?.title,
			description: eventData?.description,
			timezone: eventData?.og_timezone,
			hour_range: {
				start_hour: eventData?.hour_range.start_hour,
				end_hour: eventData?.hour_range.end_hour,
			},
			dateRange: [eventData?.date_range.start_date, eventData?.date_range.end_date],
		},
	});
	const submitForm = () => {
		// update the event in firestore
	};
	const deleteEvent = async () => {
		if (typeof eventId != "string") return;
		try {
			await deleteDoc(doc(firestore, "events", eventId));
			console.log("document deleted succesfully!");
		} catch (e) {
			console.error(e);
		}
	};

	//abstract this state into compound components for Dialog
	const [showDialog, setShowDialog] = React.useState(false);
	const openDialog = () => setShowDialog(true);
	const closeDialog = () => setShowDialog(false);
	const toggleDialog = () => setShowDialog((prevValue) => !prevValue);

	if (!eventData) {
		return <LoadingOverview />;
	}
	return (
		<div
			onClick={() => {
				if (showDialog) closeDialog();
			}}
		>
			<Header
				title={eventData.title}
				screenName="EVENT"
				photoURL={eventData.organizer_data.avatar_url}
			/>
			<Container css="pt-4 sm:pt-6 relative">
				<HomeBreadcrumbs currentPage="Event Overview" />
				<h2>Event availability</h2>
				<div className=" mb-4">
					<button
						className="relative dark-btn-transition bg-gradient-to-t from-darkBtnBottomColor to-darkBtnTopColor py-2 px-5 rounded-md text-sm font-bold before:rounded-md flex "
						onClick={toggleDialog}
					>
						<FontAwesomeIcon icon={faGear} className="w-5 h-5 mr-2" />
						Settings
					</button>

					<div
						id="dialog"
						onClick={(event) => event.stopPropagation()}
						className={`dialog-content bg-[#333] mt-2 absolute ${
							showDialog ? "block" : "hidden"
						}`}
					>
						{/* Update event form */}
						<FormProvider {...formMethods}>
							<form
								onSubmit={formMethods.handleSubmit(submitForm)}
								className="py-6 px-6 bg-gradient-to-b from-softBlackTransparent to-softBlackTransparent mx-auto rounded-md max-w-lg relative"
								autoComplete="off"
							>
								<h2 className=" font-semibold text-2xl mb-1">
									Event's settings
								</h2>
								<p className="font-medium text-shadowWhite mb-3">
									Update the details of your event here
								</p>
								<button className="h-7 absolute top-0 right-0 mr-5 mt-6">
									<FontAwesomeIcon icon={faXmark} className="h-full" />
								</button>
								<EventFormFields formMethods={formMethods} defaultTimezone={eventData.og_timezone} />
								<LightButton
									innerText="DELETE"
									btnType="button"
									clickFunc={deleteEvent}
								/>
							</form>
						</FormProvider>
					</div>
				</div>
				{/* //TODO: ADD TABLE HERE */}
				<EventAvailabalityTable />
			</Container>
		</div>
	);
}

function ParticipantOverview({
	eventData,
}: {
	eventData: EventData | undefined;
}) {
	if (!eventData) {
		return <LoadingOverview />;
	}
	return (
		<>
			<Header
				title={eventData.title}
				screenName="EVENT"
				photoURL={eventData.organizer_data.avatar_url}
			/>
			<Container css="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
				<p>Participant overview</p>
			</Container>
		</>
	);
}

function LoadingOverview() {
	return (
		<>
			<Header title={undefined} screenName="EVENT" photoURL={undefined} />
			<Container css="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
				<LoadingSpinner css="!h-60" />
			</Container>
		</>
	);
}
