import { createContext } from "react";

export interface loginContextType {
    user: string | null
    login?: (user: any) => void
    logout?: () => void
}

export const LoginContext = createContext<loginContextType>({ user: null });