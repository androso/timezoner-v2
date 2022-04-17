import "../styles/globals.css";
import { PageWrapper } from "../components/Layouts";
import { useUserData } from "../lib/hooks";
import { UserContext } from "../lib/context";
import { useMemo} from "react";

function MyApp({ Component, pageProps }) {

	const userData = useUserData();
  const memoUserData = useMemo(() => userData, [userData]);

	return (
		<UserContext.Provider value={memoUserData}>
			<PageWrapper>
				<Component {...pageProps} />
			</PageWrapper>
		</UserContext.Provider>
	);
}

export default MyApp;
