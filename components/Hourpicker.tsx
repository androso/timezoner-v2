import ReactDatePicker from "react-datepicker";
import { useController } from "react-hook-form";
import { HourPickerProps } from "../lib/utils/types";
import { useFormContext } from "react-hook-form";
import type { hoursRange } from "../lib/utils/types";
export default function Hourpicker({
	label,
	placeholder,
	required,
	name,
}: HourPickerProps) {
	const {
		getValues,
		formState: { errors },
	} = useFormContext();
	const ControllerProps = {
		name,
		defaultValue: undefined,
		rules: {
			required: true,
			validate: (value: unknown) => {
				// checking that the start hour is not later than the end hour
				const { start_hour: startHour, end_hour: endHour } = getValues()
					.hours_range as hoursRange;
				if (!startHour || !endHour) {
					return true;
				}

				if (
					startHour.getTime() > endHour.getTime() ||
					(startHour.getHours() === endHour.getHours() &&
						startHour.getMinutes() === endHour.getMinutes())
				) {
					return "Incorrect hour format";
				}

				return true;
			},
		},
	};

	const {
		field: { onBlur, onChange, value, ref },
	} = useController(ControllerProps);

	return (
		<>
			<label className="block text-lg font-medium" htmlFor="date_from">
				{label}
			</label>
			<ReactDatePicker
				{...{ name, onBlur, onChange, ref, required }}
				selected={value}
				showTimeSelect
				showTimeSelectOnly
				timeIntervals={30}
				timeCaption="Time"
				dateFormat="h:mm aa"
				className="basic-input-field max-w-[120px] placeholder:text-shadowWhite2 mr-4"
				placeholderText={placeholder}
			/>
		</>
	);
}
