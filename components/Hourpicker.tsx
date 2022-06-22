import ReactDatePicker from "react-datepicker";
import { useController } from "react-hook-form";
import { HourPickerProps } from "../lib/utils/types";

export default function HourPicker({
	label,
	placeholder,
	required,
	control,
	name,
}: HourPickerProps) {
	const ControllerProps = {
		control,
		name,
		defaultValue: undefined,
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
