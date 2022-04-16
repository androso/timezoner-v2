import React from "react";

type props = {
	Component: any;
	options: object;
};
export default function AuthenticatedRoute({ Component, options = {} }: props) {
	return <div>AuthenticatedRoute</div>;
}