import '../styles/globals.css'
import PageWrapper from "../components/Layouts/PageWrapper.tsx";

function MyApp({ Component, pageProps }) {
  return (
    <PageWrapper>
      <Component {...pageProps} />
    </PageWrapper>
  )
}

export default MyApp
