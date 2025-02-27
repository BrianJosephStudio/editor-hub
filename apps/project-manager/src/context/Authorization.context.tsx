import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthorizationContextProps {
    isAuthorized: boolean
    isAdmin: boolean
}

const AuthorizationContext = createContext<AuthorizationContextProps | undefined>(
    undefined
);

export const useAuthorization = () => {
    const context = useContext(AuthorizationContext);
    if (!context) {
        throw new Error(
            "useAuthorization must be used within a AuthorizationProvider"
        );
    }
    return context;
};

export const AuthorizationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    const authorizedRoles = ["admin"]

    useEffect(() => {
        const roles = user?.publicMetadata.roles as string[];
        if (!Array.isArray(roles)) return setIsAuthorized(false)

        const authorized = roles?.some(role => authorizedRoles.includes(role));
        const admin = roles?.some(role => role === 'admin')

        setIsAuthorized(authorized)
        setIsAdmin(admin)
    })

    return (
        <AuthorizationContext.Provider
            value={{
                isAuthorized,
                isAdmin
            }}
        >
            {children}
        </AuthorizationContext.Provider>
    );
};