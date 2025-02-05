import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from 'js-cookie'
export type DownloadLocation = 'documents' | 'projectFolder'

interface SettingsContextProps {
    downloadLocation: DownloadLocation,
    setDownloadLocationFromValue: (value: string) => void
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
    undefined
);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error(
            "useSettings must be used within a SettingsProvider"
        );
    }
    return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const downloadLocationCookieName = 'download-location'
    const [downloadLocation, setDownloadLocation] = useState<DownloadLocation>('documents')

    const setDownloadLocationFromValue = (value: string) => {
        const isValidValue = assertCookieIsDownloadLocation(value)
        if(!isValidValue) throw 'received select value is invalid'

        Cookies.set(downloadLocationCookieName, value, {expires: 730})
        setDownloadLocation(value)
    }

    const assertCookieIsDownloadLocation = (cookieValue: unknown): cookieValue is DownloadLocation => {
        if (
            cookieValue === 'documents' ||
            cookieValue === 'projectFolder'
        ) return true;
        return false
    }

    useEffect(() => {
        const downloadLocationCookie = Cookies.get(downloadLocationCookieName)
        const isValidCookie = assertCookieIsDownloadLocation(downloadLocationCookie)
        if(!isValidCookie) return

        setDownloadLocation(downloadLocationCookie)
    }, [])
    return (
        <SettingsContext.Provider
            value={{
                downloadLocation,
                setDownloadLocationFromValue
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};