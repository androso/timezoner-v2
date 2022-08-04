import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import type { BtnLinkProps } from "../components/LightButton";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import EventThumbnail from "../components/EventThumbnail";
import { useAllEvents } from "../lib/context/allUserEvents";
import LoginForm from "../components/LoginForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const Container = dynamic(() => import("../components/Layouts/Container"), {
	ssr: false,
});

const Header = dynamic(() => import("../components/Header"), { ssr: false });

const LightButtonLink = dynamic<BtnLinkProps>(
	() => import("../components/LightButton").then((md) => md.LightButtonLink),
	{
		ssr: false,
	}
);

export default function Dashboard() {
	const { parsedUser, loading: userIsLoading } = useParsedUserData();
	const {
		allEvents,
		status: allEventsStatus,
		reset: resetEvents,
		refetch,
		error,
	} = useAllEvents();
	const [eventsPageIndex, setEventsPageIndex] = React.useState(0);
	const currentPageEvents = allEvents?.slice(
		eventsPageIndex * 5,
		eventsPageIndex * 5 + 5
	);
	const handlePreviousPage = () =>
		setEventsPageIndex((prevIndex) => prevIndex - 1);

	const router = useRouter();

	React.useLayoutEffect(() => {
		if (!parsedUser) return;
		resetEvents();
		refetch();
	}, []);

	useEffect(() => {
		setEventsPageIndex(0);
	}, [parsedUser]);

	const handleNextPage = async () => {
		if (allEvents) {
			const currentIndex = eventsPageIndex + 1; // so that we start from 1 instead of 0
			const numberOfPagesAvailable = Math.ceil(allEvents.length / 5);
			if (currentIndex === numberOfPagesAvailable) {
				return;
			}
			setEventsPageIndex((prevIndex) => prevIndex + 1);
		}
	};

	if (!parsedUser && !userIsLoading) {
		return (
			<>
				<LoginForm />
			</>
		);
	}

	return (
		<>
			<Header
				title={parsedUser?.username ?? undefined}
				screenName="PROFILE"
				photoURL={parsedUser?.avatar_url ?? undefined}
			/>
			<Container css="pt-4 sm:pt-6">
				<div className="flex flex-col xs:flex-row items-start mb-3 sm:mb-9">
					<LightButtonLink
						redirectTo="/new-event"
						innerText="Create Event"
						css="mr-5 flex items-center mb-3 sm:mb-0"
					/>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							const form = e.target as unknown as {
								event_code: HTMLInputElement;
							};

							if (
								typeof form.event_code.value === "string" &&
								form.event_code.value.length > 19
							) {
								router.push(`/event/${form.event_code.value}`, undefined, {
									shallow: true,
								});
							} else {
								toast.error("incorrect event code", { duration: 1500 });
							}
						}}
						className="flex"
					>
						<input
							type="text"
							name="event_code"
							placeholder="Event code"
							autoComplete="off"
							className="bg-[#5a6f74] focus:mr-[2px] auto rounded-l-md px-2 py-3 w-[150px] sm:w-[200px]"
						/>

						<button
							type="submit"
							className=" relative bg-gradient-to-b from-[#485051] to-[#292E2E] h-auto px-2 sm:px-3 rounded-r-md dark-btn-transition before:rounded-r-md"
						>
							Join
						</button>
					</form>
				</div>

				<div>
					<div className="mb-6 flex flex-col sm:flex-row ">
						<h1 className="font-bold text-3xl grow mb-5">Upcoming Events</h1>
						<div className="flex">
							<button
								className="h-1/2 self-center p-3 sm:h-min  bg-gray-800 rounded-md mr-2  disabled:bg-gray-500"
								disabled={eventsPageIndex === 0 ? true : false}
								onClick={handlePreviousPage}
							>
								Previous
							</button>
							<p className="self-center mr-2 ">{eventsPageIndex + 1}</p>
							<button
								className={`h-1/2  self-center p-3 sm:h-min bg-gray-800 rounded-md disabled:bg-gray-500`}
								disabled={
									allEvents?.[0]
										? eventsPageIndex + 1 === Math.ceil(allEvents?.length / 5)
											? true
											: false
										: true
								}
								onClick={handleNextPage}
							>
								Next
							</button>
						</div>
					</div>
					<ul>
						{allEventsStatus === "resolved" && currentPageEvents ? (
							currentPageEvents.map((event) => {
								return (
									<li key={event.id} className="mb-3 relative">
										<EventThumbnail css="mb-2" eventData={event} />
									</li>
								);
							})
						) : error ? (
							<p>Error: {error.message}</p>
						) : (
							<LoadingSpinner css="!h-48" />
						)}
					</ul>
				</div>
			</Container>
		</>
	);
}
