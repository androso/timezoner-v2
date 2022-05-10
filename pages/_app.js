import "../styles/globals.css";
import { useUserData } from "../lib/hooks";
import { UserContext } from "../lib/context";
import "../styles/datepicker.css";
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

function MyApp({ Component, pageProps }) {
	const userData = useUserData();
	// console.log("userData at _app.js", userData);

	return (
		<UserContext.Provider value={userData}>
			<DynamicPageWrapper>
				<Component {...pageProps} />
			</DynamicPageWrapper>
			<DynamicToaster />
		</UserContext.Provider>
	);
}

export default MyApp;
