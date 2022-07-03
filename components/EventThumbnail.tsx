import Image from "next/image";
import Link from "next/link";
import React from "react";
import { EventData } from "../lib/utils/types";

//TODO: WORK ON HOW TO FORMAT CORRECTLY THE DATE RANGE
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
export default function EventThumbnail({
	eventData,
}: {
	eventData: EventData;
}) {
	const startDate = getFormattedDate(eventData.date_range.start_date);
	const endDate = getFormattedDate(eventData.date_range.end_date);

	return (
		<Link href={`/event/${eventData.id}`}>
			<a>
				<div className="border-2 border-orange-400 flex">
					<Image
						src={eventData.organizer_data.avatar_url}
						width="60"
						height="60"
					/>
					<div>
						<h6>{eventData.title}</h6>
						<p>
							{startDate} - {endDate}
						</p>
					</div>
				</div>
			</a>
		</Link>
	);
}
