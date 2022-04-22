import { getApp, initializeApp } from "firebase-admin/app";
import { adminAppConfig } from "./types";

export const createFirebaseAdminApp = (config: adminAppConfig) => {
	try {
		return getApp();
	} catch {
		return initializeApp(config);
	}
}
