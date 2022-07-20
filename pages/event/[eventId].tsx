import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useEventData from "../../lib/utils/hooks/useEventData";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import LoadingSpinner from "../../components/LoadingSpinner";
import { EventData, EventFormValues } from "../../lib/utils/types";
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
import {
	getDatesBetweenRange,
	getHoursBetweenRange,
} from "../../lib/utils/client-helpers";
import toast from "react-hot-toast";
import EventSchedulingTable from "../../components/EventSchedulingTable";

export default function EventId() {
	const { eventData, status: eventStatus, error: eventError } = useEventData();
	const { parsedUser } = useParsedUserData();

	// we have to check if eventStatus is success and also if eventData is not null
	// because for useQuery, the action was succesful as long as it didn't throw an error
	if (eventStatus === "success" && parsedUser && eventData) {
		if (parsedUser?.id === eventData?.organizer_data.id) {
			return <OrganizerOverview eventData={eventData} />;
		} else {
			return <ParticipantOverview eventData={eventData} />;
		}
	}

	return (
		<ProtectedRoute>
			{(eventStatus === "success" && !eventData) ||
			eventStatus === "loading" ? (
				<LoadingOverview />
			) : eventStatus === "error" ? (
				eventError instanceof Error ? (
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
				)
			) : null}
		</ProtectedRoute>
	);
}

function OrganizerOverview({
	eventData,
}: {
	eventData: EventData | undefined;
}) {
	const { parsedUser } = useParsedUserData();
	const router = useRouter();
	const [showDialog, setShowDialog] = React.useState(false);
	const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);
	const closeDialog = () => setShowDialog(false);
	const toggleDialog = () => setShowDialog((prevValue) => !prevValue);

	const datesRange = eventData
		? getDatesBetweenRange(
				eventData.date_range.start_date,
				eventData.date_range.end_date
		  )
		: undefined;

	const hoursRange = eventData
		? getHoursBetweenRange(
				eventData.hour_range.start_hour,
				eventData.hour_range.end_hour
		  )
		: undefined;
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
			toast.error("There was an error deleting the event");
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
			try {
				await setDoc(eventDocRef, dataSentToFirestore, { merge: true });
				closeDialog();
				toast.success("Event updated succesfully");
			} catch (e) {
				toast.error("There was an error while updating the event");
			}
		}
	};

	if (!eventData) {
		return (
			<LoadingOverview>
				<LoadingSpinner />
			</LoadingOverview>
		);
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
						} sm:min-w-[460px]`}
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
									type="button"
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
										className={`bg-gray-300 relative text-darkText font-semibold rounded-md px-6 py-3 hover:bg-red-500 focus:bg-red-600 hover:text-whiteText1 transition-colors`}
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
			</Container>
		</div>
	);
}

function ParticipantOverview({
	eventData,
}: {
	eventData: EventData | undefined;
}) {
	const datesRange = eventData
		? getDatesBetweenRange(
				eventData.date_range.start_date,
				eventData.date_range.end_date
		  )
		: undefined;

	const hoursRange = eventData
		? getHoursBetweenRange(
				eventData.hour_range.start_hour,
				eventData.hour_range.end_hour
		  )
		: undefined;
	const [tableView, setTableView] = React.useState<
		"availability" | "scheduling"
	>("scheduling");

	const [isTouchDevice, setIsTouchDevice] = React.useState(false);

	if (!eventData) {
		return <LoadingOverview />;
	}

	React.useEffect(() => {
		let check = false;
		(function (a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
					a
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					a.substr(0, 4)
				)
			)
				check = true;
		})(navigator.userAgent || navigator.vendor);
		setIsTouchDevice(check);
	}, []);

	return (
		<>
			<Header
				title={eventData.title}
				screenName="EVENT"
				photoURL={eventData.organizer_data.avatar_url}
			/>
			<Container css="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
				<h1 className="font-bold text-3xl">
					Welcome to {eventData.organizer_data.username}'s Event
				</h1>
				<p>{eventData.description}</p>
				{/* We'll have a select timezone that will change the hours displayed on the table */}
				<div className="mb-4 ">
					{/* //TODO: add styles */}
					<button
						className="p-3 bg-containerGray rounded-sm mr-3"
						onClick={() => setTableView("scheduling")}
					>
						Scheduling
					</button>
					<button
						className="p-3 bg-containerGray rounded-sm"
						onClick={() => setTableView("availability")}
					>
						Availability
					</button>
				</div>
				{tableView === "scheduling" ? (
					<>
						<EventSchedulingTable
							hoursRange={hoursRange}
							datesRange={datesRange}
						/>
						<p>
							Note:{" "}
							{isTouchDevice
								? "Press on an hour to toggle select"
								: "click and drag to select schedules, click on an hour to unselect"}
						</p>
					</>
				) : (
					<p>availability</p>
				)}
			</Container>
		</>
	);
}

function LoadingOverview({ children }: { children?: any }) {
	return (
		<>
			<Header title={undefined} screenName="EVENT" photoURL={undefined} />
			<Container css="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
				{children}
			</Container>
		</>
	);
}
