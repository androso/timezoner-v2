import Link from "next/link";

export default function HomeBreadcrumbs({
	currentPage,
	css,
}: {
	currentPage: string;
	css?: string;
}) {
	return (
		<h3 className={`font-semibold text-2xl ${css}`}>
			<span className="text-secondaryTextColor hover:text-whiteText1 ease-in duration-300 hover:underline ">
				<Link href="/dashboard">Home</Link>
			</span>
			<span> / </span>
			<span>{currentPage}</span>
		</h3>
	);
}
