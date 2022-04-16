import "../styles/globals.css";
import { PageWrapper } from "../components/Layouts";
import { useEffect} from 'react';
import { useUserData } from '../lib/hooks';
import { UserContext } from '../lib/context';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
	return (
    <UserContext.Provider value={userData}>
      <PageWrapper>
        <Component {...pageProps} />
      </PageWrapper>
    </UserContext.Provider>
	);
}

export default MyApp;
