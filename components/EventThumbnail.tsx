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
	css,
}: {
	eventData: EventData;
	css?: string;
}) {
	const startDate = getFormattedDate(eventData.date_range.start_date);
	const endDate = getFormattedDate(eventData.date_range.end_date);

	return (
		<Link href={`/event/${eventData.id}`}>
			<a className={`${css}`}>
				<div className=" flex py-6 px-4 rounded-md bg-gradient-to-t from-eventGradientBott to-eventGradientTop">
					<div className="mr-2 relative h-16 w-16">
						<Image src={eventData.organizer_data.avatar_url} layout="fill" />
					</div>
					<div className="flex flex-col justify-center">
						<h6 className="font-semibold text-xl">{eventData.title}</h6>
						<p className="font-medium text-secondaryWhite">
							{startDate} - {endDate}
						</p>
					</div>
				</div>
			</a>
		</Link>
	);
}
