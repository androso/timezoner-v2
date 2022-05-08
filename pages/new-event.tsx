import dynamic from "next/dynamic";

const Container = dynamic(() => import("../components/Layouts/Container"), {
	ssr: false,
});

const ProtectedRoute = dynamic(() => import("../components/ProtectedRoute"), {
	ssr: false,
});

const CreateEventForm = dynamic(() => import("../components/CreateEventForm"), {
	ssr: false,
});

const LogoutButton = dynamic(() => import("../components/LogoutButton"), {
	ssr: false,
});

const HomeBreadcrumbs = dynamic(() => import("../components/HomeBreadcrumbs"), {
	ssr: false,
});

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
