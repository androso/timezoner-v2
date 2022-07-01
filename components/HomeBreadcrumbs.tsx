import Link from "next/link";

export default function HomeBreadcrumbs({ currentPage }: { currentPage: string }) {
	return (
		<h3 className="mb-14 font-semibold text-2xl">
			<span className="text-secondaryTextColor hover:text-whiteText1 ease-in duration-300 hover:underline ">
				<Link href="/dashboard">Home</Link>
			</span>
			<span> / </span>
			<span>{currentPage}</span>
		</h3>
	);
}