import React from "react";

export type PageWrapperProps = {
	children: any;
};

export default function PageWrapper({ children }: PageWrapperProps) {
	return (
		<div className="page-wrapper bg-gradient-to-t from-gunMetal to-blackCoral min-h-screen text-whiteText1 font-sans font-normal">
			{children}
		</div>
	);
}
