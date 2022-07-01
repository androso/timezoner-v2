import "../styles/globals.css";
import { AuthProvider } from "../lib/context";

import dynamic from "next/dynamic";
import type { AppProps } from "next/app";
import type { PageWrapperProps } from "../components/Layouts/PageWrapper";
import type { ToasterProps } from "react-hot-toast";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
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

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<DynamicPageWrapper>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Component {...pageProps} />
					<DynamicToaster />
				</AuthProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</DynamicPageWrapper>
	);
}

export default MyApp;
