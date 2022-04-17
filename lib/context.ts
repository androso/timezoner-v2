import { createContext } from "react";
import { User } from "firebase/auth";
export interface userContextType { 
    user: User | null | undefined,
    error: Error | undefined,
    isLoggedIn: boolean,
    loading: boolean
}

export const UserContext = createContext<userContextType>({user: null, error: new Error('default values'), isLoggedIn: false, loading: true});