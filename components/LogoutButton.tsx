import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

export default function LogoutButton({}) {
	const logOut = async () => {
		try {
			const result = await signOut(auth);
			console.log("succesfully signed out!");
		} catch (error) {
			console.error(error);
			toast.error("There was an error while login out", {
				duration: 4050,
			});
		}
	};
	return (
		<button
			type="button"
			className="dark-btn-transition before:rounded-2xl absolute top-5 right-0 bg-gradient-to-t from-darkBtnBottomColor to-darkBtnTopColor py-2 px-5 rounded-2xl text-sm font-bold"
			onClick={logOut}
		>
			Log Out
		</button>
	);
}
