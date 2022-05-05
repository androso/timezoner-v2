import React from "react";
import { LogoutButton, ProtectedRoute, CreateEventForm } from "../components";
import { Container } from "../components/Layouts";

export default function NewEvent() {
	return (
        <>
            <Container className="bg-slate-300 relative h-32">
                <LogoutButton />
            </Container>
            <Container className="bg-black">
                <h3 className="mb-14">Home / Form</h3>    
                <CreateEventForm />
            </Container>
        </>
	);
}
