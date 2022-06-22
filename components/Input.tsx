import { inputProps } from "../lib/utils/types";

// Move to its own component?
export default function Input({
	label,
	placeholder,
	required,
	register,
	name,
}: inputProps) {
	return (
		<>
			<label className="block font-medium text-lg" htmlFor="event_title">
				{label}
			</label>
			<input
				className="w-full basic-input-field placeholder:text-shadowWhite2"
				type="text"
				id="event_title"
				placeholder={placeholder}
				autoComplete="off"
				required={required ? true : false}
				{...register(name, { required })}
                
			/>
		</>
	);
}
