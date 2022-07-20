import "../styles/globals.css";
import { AuthProvider } from "../lib/context/auth";

import dynamic from "next/dynamic";
import type { AppProps } from "next/app";
import type { PageWrapperProps } from "../components/Layouts/PageWrapper";
import type { ToasterProps } from "react-hot-toast";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { EventsProvider } from "../lib/context/allUserEvents";
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

export const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<DynamicPageWrapper>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<EventsProvider>
						<Component {...pageProps} />
						<DynamicToaster />
					</EventsProvider>
				</AuthProvider>
			</QueryClientProvider>
		</DynamicPageWrapper>
	);
}

export default MyApp;
