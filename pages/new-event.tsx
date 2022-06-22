import dynamic from "next/dynamic";
import CreateEventForm	 from "../components/CreateEventForm";
const Container = dynamic(() => import("../components/Layouts/Container"), {
	ssr: false,
});

const ProtectedRoute = dynamic(() => import("../components/ProtectedRoute"), {
	ssr: false,
});

const LogoutButton = dynamic(() => import("../components/LogoutButton"), {
	ssr: false,
});

const HomeBreadcrumbs = dynamic(() => import("../components/HomeBreadcrumbs"), {
	ssr: false,
});

export default function NewEvent() {
	return (
		<ProtectedRoute>
			<SimpleHeader />
			<Container className="">
				<HomeBreadcrumbs currentPage="Form" />
				<CreateEventForm />
			</Container>
		</ProtectedRoute>
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
