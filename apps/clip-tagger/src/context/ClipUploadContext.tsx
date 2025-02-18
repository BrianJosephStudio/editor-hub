import { ClipUpload } from "@editor-hub/api-sdk/dist/ClipUploads";
import { Metadata } from "@editor-hub/dropbox-types";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface ClipUploadContextProps {
    clipUploads: ClipUpload[],
    setClipUploads: React.Dispatch<React.SetStateAction<ClipUpload[]>>
    selectedPatch: Metadata | null,
    setSlectedPatch: React.Dispatch<React.SetStateAction<Metadata | null>>
    uploading: boolean,
    setUploading: React.Dispatch<React.SetStateAction<boolean>>
}

const ClipUploadContext = createContext<ClipUploadContextProps | undefined>(
    undefined
);

export const useClipUpload = () => {
    const context = useContext(ClipUploadContext);
    if (!context) {
        throw new Error(
            "useClipUpload must be used within a ClipUploadProvider"
        );
    }
    return context;
};

export const ClipUploadProvider = ({ children }: { children: ReactNode }) => {
    const [clipUploads, setClipUploads] = useState<ClipUpload[]>([]);
    const [selectedPatch, setSlectedPatch] = useState<Metadata | null>(null)
    const [uploading, setUploading] = useState<boolean>(false)

    return (
        <ClipUploadContext.Provider
            value={{
                clipUploads,
                setClipUploads,
                selectedPatch,
                setSlectedPatch,
                uploading,
                setUploading,
            }}
        >
            {children}
        </ClipUploadContext.Provider>
    );
};