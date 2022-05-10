import React from "react";
import dynamic from "next/dynamic";

type BtnProps = {
	innerText: string;
	className?: string;
	clickFunc?: () => void;
	btnType?: "button" | "submit" | "reset";
};

export default function LightButton({
	innerText,
	className,
	clickFunc,
	btnType,
}: BtnProps) {
	return (
		<button
			type={btnType ? btnType : "button"}
			onClick={() => {
				if (clickFunc) clickFunc();
			}}
			className={`light-btn-transition relative bg-gradient-to-t from-lightBtnBottColor to-lightBtnTopColor text-darkText font-semibold rounded-md px-6 py-3 ${className} `}
		>
			{innerText.toUpperCase()}
		</button>
	);
}
