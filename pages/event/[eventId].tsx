import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useEventData from "../../lib/utils/hooks/useEventData";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import "@reach/dialog/styles.css";
import ParticipantOverview from "../../screens/eventId/ParticipantOverview";
import OrganizerOverview from "../../screens/eventId/OrganizerOverview";
import toast from "react-hot-toast";

export default function EventId() {
	const { eventData, status: eventStatus, error: eventError } = useEventData();
	const { parsedUser } = useParsedUserData();
	// we have to check if eventStatus is success and also if eventData is not null
	// because for useQuery, the action was succesful as long as it didn't throw an error
	if (eventStatus === "success" && parsedUser && eventData) {
		return (
			<>
				{parsedUser?.id === eventData?.organizer_data.id ? (
					<OrganizerOverview eventData={eventData} />
				) : (
					<ParticipantOverview eventData={eventData} />
				)}

				<h4 className="mb-3 mt-8  font-bold text-lg text-center">
					Share with Friends
				</h4>
				<div className="flex justify-center mb-10">
					<button
						className="py-3 px-4 bg-gradient-to-b from-[#48808E] to-[#2B4C55] rounded-md mr-6 "
						onClick={async () => {
							try {
								const { state } = await navigator.permissions.query({
									name: "clipboard-write",
								});
								if (state == "granted" || state == "prompt") {
									/* write to the clipboard now */
									navigator.clipboard.writeText(eventData.id);
									toast.success("Copied succesfully");
								}
							} catch (e: unknown) {
								toast.error("Browser doesn't support this feature :(", {
									duration: 3700,
								});
								console.error(e);
							}
						}}
					>
						Copy Code
					</button>
					<button
						className="py-3 px-4 bg-gradient-to-b from-[#48808E] to-[#2B4C55] rounded-md "
						onClick={async () => {
							try {
								const { state } = await navigator.permissions.query({
									name: "clipboard-write",
								});

								if (state == "granted" || state == "prompt") {
									/* write to the clipboard now */
									navigator.clipboard.writeText(window.location.href);
									toast.success("Copied succesfully");
								}
							} catch (e) {
								toast.error("Browser doesn't support this feature :(", {
									duration: 3700,
								});
								console.error(e);
							}
						}}
					>
						Copy Link
					</button>
				</div>
			</>
		);
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

export function LoadingOverview({ children }: { children?: any }) {
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
