import { createContext } from "react";
import { User } from "firebase/auth";
import { UserData } from "./utils/types";

export interface userContextType { 
    user: User | null | undefined,
    error: Error | undefined,
    isLoggedIn: boolean,
    loading: boolean,
    userData: null | UserData
}

export const UserContext = createContext<userContextType>({user: null, error: new Error('default values'), isLoggedIn: false, loading: true, userData: null});