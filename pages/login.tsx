import { useAuth } from "../lib/context/auth";
import dynamic from "next/dynamic";
import UnprotectedRoute from "../components/UnprotectedRoute";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
	ssr: false,
});

const LoadingSpinner = dynamic(() => import("../components/LoadingSpinner"), {
	ssr: false,
});

export default function loginPage() {
	const { user, loading } = useAuth();

	if (loading) {
		return <LoadingSpinner />;
	}
	return (
		<UnprotectedRoute>
			<LoginForm />
		</UnprotectedRoute>
	);
}
