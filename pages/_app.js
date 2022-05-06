import "../styles/globals.css";
import { PageWrapper } from "../components/Layouts";
import { useUserData } from "../lib/hooks";
import { UserContext } from "../lib/context";
import { useMemo } from "react";
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
	const userData = useUserData();
	// console.log("userData at _app.js", userData);
	
	return (
		<UserContext.Provider value={userData}>
			<PageWrapper>
				<Component {...pageProps} />
			</PageWrapper>
			<Toaster />
		</UserContext.Provider>
	);
}

export default MyApp;
