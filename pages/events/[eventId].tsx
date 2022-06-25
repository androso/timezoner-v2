import React from "react";
import { useRouter } from "next/router";
export default function eid() {
	const router = useRouter();
	const { eventId } = router.query;
	return <div>event id: {eventId}</div>;
}
