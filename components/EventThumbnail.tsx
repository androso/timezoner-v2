import Image from "next/image";
import Link from "next/link";
import React from "react";
import { EventData } from "../lib/utils/types";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getFormattedDate = (date: Date) => {
	const allMonths = [
		"Jan",
		"Febr",
		"March",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];
	const month = allMonths[date.getMonth()];
	const day = date.getDate();
	return `${month} ${day}`;
};
function EventThumbnail({
	eventData,
	css,
}: {
	eventData: EventData;
	css?: string;
}) {
	const startDate = getFormattedDate(eventData.date_range[0]);
	const endDate = getFormattedDate(eventData.date_range[eventData.date_range.length - 1]);
	return (
		<Link href={`/event/${eventData.id}`}>
			<a className={`${css} event-btn-transition`}>
				<div className=" flex py-6 px-4 rounded-md bg-gradient-to-t from-eventGradientBott to-eventGradientTop z-0 event-btn-transition relative">
					<div className="mr-2 relative h-16 w-16 sm:w-20 sm:h-20">
						<Image
							src={eventData.organizer_data.avatar_url}
							layout="fill"
							className="rounded-full"
						/>
					</div>
					<div className="flex flex-col justify-center grow">
						<h6 className="font-semibold text-xl">{eventData.title}</h6>
						<p className="font-medium text-secondaryWhite">
							{startDate === endDate ? startDate : `${startDate} - ${endDate}`}
						</p>
					</div>
					<span className="self-center mr-2 text-secondaryWhite">
						<FontAwesomeIcon icon={faChevronRight} className="h-5" />
					</span>
				</div>
			</a>
		</Link>
	);
}
EventThumbnail.displayName = "EventThumbnail";
export default EventThumbnail;