import "../styles/globals.css";
import "../styles/datepicker.css";
import { AuthProvider } from "../lib/context";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { PageWrapperProps } from "../components/Layouts/PageWrapper";

const DynamicPageWrapper = dynamic<PageWrapperProps>(
	() => import("../components/Layouts").then((mod) => mod.PageWrapper),
	{
		ssr: false,
	}
);

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<DynamicPageWrapper>
			<AuthProvider>
				<Component {...pageProps} />
				<Toaster />
			</AuthProvider>
		</DynamicPageWrapper>
	);
}

export default MyApp;
