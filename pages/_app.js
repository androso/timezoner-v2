import "../styles/globals.css";
import { PageWrapper } from "../components/Layouts";
import { useUserData } from "../lib/hooks";
import { UserContext } from "../lib/context";
import { useMemo } from "react";
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
	const userData = useUserData();
	const memoUserData = useMemo(() => userData, [userData]);

	return (
		<UserContext.Provider value={memoUserData}>
			<PageWrapper>
				<Component {...pageProps} />
			</PageWrapper>
			<Toaster />
		</UserContext.Provider>
	);
}

export default MyApp;
