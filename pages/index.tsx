import Head from "next/head";
import { LightButtonLink } from "../components/LightButton";
import UnprotectedRoute from "../components/UnprotectedRoute";

export default function Home() {
	return (
		<UnprotectedRoute>
			<div className="min-h-screen flex flex-col justify-center items-center text-center">
				<Head>
					<title>Timezoner</title>
					<meta name="description" content="" />
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<main className="">
					<h1 className="text-3xl font-bold underline">
						Hello there from timezoner
					</h1>
					<LightButtonLink
						css="mt-4"
						innerText="Go to the app"
						redirectTo="/login"
					/>
				</main>
			</div>
		</UnprotectedRoute>
	);
}
