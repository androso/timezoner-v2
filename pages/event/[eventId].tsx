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
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import { LightButton } from "../../components/LightButton";
import EventFormFields from "../../components/EventFormFields";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import "@reach/dialog/styles.css";

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
	const { parsedUser } = useParsedUserData();
	//TODO: replace this implementation with ReachUI/dialog
	//TODO: handle any form of error DONT BE LAZY DUDE YOU GOTTA DO IT!
	//TODO: add double authorization dialog when deleting an event
	//abstract this state into compound components for Dialog
	const [showDialog, setShowDialog] = React.useState(false);
	const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);
	const openDialog = () => setShowDialog(true);
	const closeDialog = () => setShowDialog(false);
	const toggleDialog = () => setShowDialog((prevValue) => !prevValue);

	const router = useRouter();
	const { eventId } = router.query;
	const formMethods = useForm<EventFormValues>({
		defaultValues: {
			title: eventData?.title,
			description: eventData?.description,
			timezone: eventData?.og_timezone,
			hour_range: {
				start_hour: eventData?.hour_range.start_hour,
				end_hour: eventData?.hour_range.end_hour,
			},
			dateRange: [
				eventData?.date_range.start_date,
				eventData?.date_range.end_date,
			],
		},
	});
	const deleteEvent = async () => {
		if (typeof eventId != "string") return;
		try {
			await deleteDoc(doc(firestore, "events", eventId));
			router.push("/dashboard", undefined, { shallow: true });
		} catch (e) {
			console.error(e);
		}
	};

	const updateEvent = async (data: EventFormValues) => {
		const { dateRange, hour_range, description, title, timezone } = data;

		if (eventData?.id && parsedUser) {
			const eventDocRef = doc(firestore, "events", eventData?.id);
			const dataSentToFirestore = {
				date_range: {
					start_date: dateRange[0],
					end_date: dateRange[1] ?? dateRange[0],
				},
				hour_range,
				title,
				description: description,
				og_timezone: timezone,
			};
			setDoc(eventDocRef, dataSentToFirestore, { merge: true });
			closeDialog();
		}
	};

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
			<Container css="pt-4 sm:pt-6 relative mb-72">
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
								onSubmit={formMethods.handleSubmit(updateEvent)}
								className="py-6 px-6 bg-gradient-to-b from-softBlackTransparent to-softBlackTransparent mx-auto rounded-md max-w-lg relative"
								autoComplete="off"
							>
								<h2 className=" font-semibold text-2xl mb-1">
									Event's settings
								</h2>
								<p className="font-medium text-shadowWhite mb-3">
									Update the details of your event here
								</p>
								<button
									className="h-7 absolute top-0 right-0 mr-5 mt-6"
									onClick={closeDialog}
								>
									<FontAwesomeIcon icon={faXmark} className="h-full" />
								</button>
								<EventFormFields
									formMethods={formMethods}
									defaultTimezone={eventData.og_timezone}
								/>
								<div className="flex flex-col w-2/3 mx-auto">
									<LightButton
										innerText="UPDATE EVENT"
										btnType="submit"
										css={"mb-3"}
									/>
									<button
										type="button"
										onClick={() => setShowDeleteWarning(true)}
										className={`bg-gray-300 relative text-darkText font-semibold rounded-md px-6 py-3 hover:bg-red-500 hover:text-whiteText1 transition-colors`}
									>
										DELETE EVENT
									</button>
								</div>
							</form>
						</FormProvider>
					</div>
					<DialogOverlay
						isOpen={showDeleteWarning}
						onDismiss={() => {
							setShowDeleteWarning(false);
							closeDialog();
						}}
						style={{ background: "hsla(0, 0%, 0%, 0.5)" }}
					>
						<DialogContent
							aria-label="Delete event warning"
							className="!bg-[#3e4559] text-whiteText1 shadow-md !min-w-fit !sm:w-[50vw] relative"
						>
							<span role="heading" className="text-2xl font-bold">
								Delete Event
							</span>
							<button
								className="h-7 absolute top-0 right-0 mr-5 mt-6"
								onClick={() => {
									setShowDeleteWarning(false);
									setShowDialog(false);
								}}
							>
								<FontAwesomeIcon icon={faXmark} className="h-full" />
							</button>
							<p className="mb-4">
								Are you sure you want to delete this event? this action can't be
								undone
							</p>
							<div className="flex justify-end">
								<button className="px-3 py-1 bg-slate-500 rounded-md text-lg mr-2 transition-all border-2 border-transparent hover:border-whiteText1">
									Cancel
								</button>
								<button
									onClick={() => deleteEvent()}
									className="px-3 py-1 text-lg bg-red-500 rounded-md transition-all border-2 border-transparent hover:border-whiteText1"
								>
									Delete Event
								</button>
							</div>
						</DialogContent>
					</DialogOverlay>
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
