import React from "react";
import Link from "next/link";

export type BtnProps = {
	innerText: string;
	css?: string;
	clickFunc?: Function;
	btnType?: "button" | "submit" | "reset";
};

export function LightButton({ innerText, css, clickFunc, btnType }: BtnProps) {
	return (
		<button
			type={btnType ? btnType : "button"}
			onClick={() => {
				if (clickFunc) clickFunc();
			}}
			className={`light-btn-transition relative bg-gradient-to-t from-lightBtnBottColor to-lightBtnTopColor text-darkText font-semibold rounded-md px-6 py-3 ${css} `}
		>
			{innerText.toUpperCase()}
		</button>
	);
}

export type BtnLinkProps = {
	innerText: string;
	css?: string;
	clickFunc?: () => any;
	redirectTo: string;
};

export function LightButtonLink({
	innerText,
	css,
	clickFunc,
	redirectTo,
}: BtnLinkProps) {
	return (
		<Link href={redirectTo}>
			<a
				onClick={() => {
					clickFunc?.();
				}}
				className={`inline-block light-btn-transition relative bg-gradient-to-t from-lightBtnBottColor to-lightBtnTopColor text-darkText font-semibold rounded-md px-6 py-3 ${css} `}
			>
				{innerText.toUpperCase()}
			</a>
		</Link>
	);
}
