import "../styles/globals.css";
import "../styles/datepicker.css";
import { AuthProvider, UserContext } from "../lib/context";
import dynamic from "next/dynamic";
const DynamicToaster = dynamic(
	() => import("react-hot-toast").then((mod) => mod.Toaster),
	{
		ssr: false,
	}
);

const DynamicPageWrapper = dynamic(
	() => import("../components/Layouts").then((mod) => mod.PageWrapper),
	{
		ssr: false,
	}
);

const DyanmicAuthProvider = dynamic(
	() => import("../lib/context").then((mod) => mod.AuthProvider),
	{
		ssr: false,
	}
);

function MyApp({ Component, pageProps }) {
	return (
		<DynamicPageWrapper>
			<AuthProvider>
				<Component {...pageProps} />

				<DynamicToaster />
			</AuthProvider>
		</DynamicPageWrapper>
	);
}

export default MyApp;
