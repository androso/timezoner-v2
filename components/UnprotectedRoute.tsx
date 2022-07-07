import { useRouter } from "next/router";
import { useAuth } from "../lib/context/auth";

type props = {
	children: any;
};

export default function UnprotectedRoute({ children }: props) {
	const { user, loading } = useAuth();
	const router = useRouter();

	if (user != null && !loading) {
		router.push("/dashboard", undefined, { shallow: true });
	} else if (user == null && !loading) {
		return children;
	}
}
