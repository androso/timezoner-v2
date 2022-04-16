import { createContext } from "react";

interface UserContext {
    user: any
}

export const UserContext = createContext<UserContext>({ user: null});