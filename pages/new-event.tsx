import React from "react";
import {
	LogoutButton,
	HomeBreadcrumbs,
	ProtectedRoute,
	CreateEventForm,
} from "../components";
import { Container } from "../components/Layouts";

//TODO: add protectedRoute here

export default function NewEvent() {
	return (
		<>
			<SimpleHeader />
			<Container className="">
				<HomeBreadcrumbs currentPage="Form" />
				<CreateEventForm />
			</Container>
		</>
	);
}

function SimpleHeader() {
	return (
		<div className="h-16">
			<Container className="relative">
				<LogoutButton />
			</Container>
		</div>
	);
}
