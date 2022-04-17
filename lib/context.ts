import { createContext } from "react";

interface UserContext {
    user: any,
    isLoggedIn: boolean | undefined,
    loading: boolean
}

export const UserContext = createContext<UserContext>({ user: undefined, isLoggedIn: undefined, loading: true});