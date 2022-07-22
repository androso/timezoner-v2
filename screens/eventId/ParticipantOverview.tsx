import React from "react";
import EventSchedulingTable from "../../components/EventSchedulingTable";
import Header from "../../components/Header";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import { Container } from "../../components/Layouts";
import {
	getDatesBetweenRange,
	getHoursBetweenRange,
} from "../../lib/utils/client-helpers";
import { EventData } from "../../lib/utils/types";
import {
	defaultTimezone as localTimezone,
	timezonesLabels,
} from "../../lib/timezonesData";
import { LoadingOverview } from "../../pages/event/[eventId]";
import Downshift from "downshift";
import { matchSorter } from "match-sorter";

export default function ParticipantOverview({
	eventData,
}: {
	eventData: EventData | undefined;
}) {
	const [tableView, setTableView] = React.useState<
		"availability" | "scheduling"
	>("scheduling");
	const [isTouchDevice, setIsTouchDevice] = React.useState(false);
	const [timezoneSelected, setTimezoneSelected] = React.useState<string | null>(
		localTimezone.label
	);
	const datesRange = eventData?.date_range;
	const hoursRange = eventData?.hour_range;
	
	

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
				<HomeBreadcrumbs currentPage="Event" css="mb-4" />
				<h1 className="font-bold text-3xl mb-3">
					Welcome to {eventData.organizer_data.username}'s Event
				</h1>
				<p className="mb-4">{eventData.description}</p>
				<div className="mb-4">
					{/* We'll have a select timezone that will change the hours displayed on the table */}
					<Downshift
						itemToString={(item) => (item ? item : "")}
						initialSelectedItem={localTimezone.label}
						onSelect={(tz) => setTimezoneSelected(tz)}
					>
						{({
							getInputProps,
							getItemProps,
							getLabelProps,
							getMenuProps,
							getToggleButtonProps,
							isOpen,
							inputValue,
							getRootProps,
							highlightedIndex,
						}) => (
							<div className="relative">
								<label {...getLabelProps()} className="text-gray-300 text-base">
									Your Timezone:
								</label>

								<div
									/* 
									// @ts-ignore */
									{...getRootProps({}, { suppressRefError: true })}
									className="flex w-full"
								>
									<input
										{...getInputProps()}
										className={`basic-input-field grow rounded-r-none rounded-br-none border-r-0 w-full !bg-[#2E2E2E]`}
									/>
									<button
										aria-label={"toggle menu"}
										className={`px-3 bg-deepBlack border-solid border-[#4e4e4e] border-[1px] rounded-r-md rounded-br-md !bg-[#2E2E2E] `}
										type="button"
										{...getToggleButtonProps()}
									>
										{isOpen ? <span>&#8593;</span> : <span>&#8595;</span>}
									</button>
								</div>
								<ul
									{...getMenuProps()}
									className={`${
										isOpen ? "visible" : "invisible"
									} mt-1 max-h-48 w-full overflow-y-scroll absolute z-10 border-solid border-[#415d95] border-[1px] !bg-[#2E2E2E]`}
								>
									{isOpen
										? (inputValue != "" && inputValue != null
												? matchSorter(timezonesLabels, inputValue, {
														threshold: matchSorter.rankings.CONTAINS,
												  })
												: timezonesLabels
										  ).map((item, index) => {
												//TODO: The value sent to react-hook-forms should be "America/El_Salvador"
												//TODO: and the value displayed "America/El Salvador"
												return (
													<li
														{...getItemProps({
															key: item,
															index,
															item,
														})}
														className={`px-4 py-3 ${
															highlightedIndex === index ? "bg-[#393d3f]" : null
														}`}
													>
														{item}
													</li>
												);
										  })
										: null}
								</ul>
							</div>
						)}
					</Downshift>
				</div>
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
							eventData={eventData}
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
