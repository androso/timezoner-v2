import "../styles/globals.css";
import "../styles/datepicker.css";
import { AuthProvider } from "../lib/context";
import dynamic from "next/dynamic";
import type { AppProps } from "next/app";
import type { PageWrapperProps } from "../components/Layouts/PageWrapper";
import type { ToasterProps } from "react-hot-toast";

const DynamicToaster = dynamic<ToasterProps>(
	() => import("react-hot-toast").then((md) => md.Toaster),
	{
		ssr: false,
	}
);

const DynamicPageWrapper = dynamic<PageWrapperProps>(
	() => import("../components/Layouts/PageWrapper"),
	{
		ssr: false,
	}
);

function MyApp({ Component, pageProps }: AppProps) {
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
