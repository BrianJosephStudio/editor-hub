
import { Box } from "@mui/material";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import apiClient from "../../../api/ApiClient";
import { FileTreeNode } from "../../../types/app";
import { compressText, decompressText, downloadTextAsFile } from "./util";
import { useAuthorization } from "../../../contexts/Authorization.context";

interface DragAndDropTextProps {
    children?: ReactNode;
    fileTreeNode: FileTreeNode;

}

export const DragAndDrop: React.FC<DragAndDropTextProps> = ({ children, fileTreeNode }) => {
    const { isAdmin } = useAuthorization()

    const onFetchLicense = async () => {
        const metadata = await apiClient.getTrackLicenseFromMetadata(fileTreeNode.metadata?.path_lower!)
        if (!metadata) return;
        const license = decompressText(metadata)

        if (!license) return;
        downloadTextAsFile(license, `${fileTreeNode.name}_license.txt`)
        console.log(license)
    }

    const onRemoveLicense = async () => {
        if (!isAdmin) return console.log("You don't have permission to perform this action.")
        await apiClient.removeFilePropertyGroup(fileTreeNode.metadata?.path_display!, apiClient.trackLicenseTemplateId)
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const x = (e: ProgressEvent<FileReader>) => {
                        if (!e || !e.target || !e.target.result) throw new Error("e has unexpected schema")
                        apiClient.getTrackLicenseFromMetadata(fileTreeNode.metadata?.path_lower!)
                        const compressedValue = compressText(e?.target?.result as string)
                        apiClient.updateFileProperties(fileTreeNode.metadata?.path_lower!, compressedValue, apiClient.trackLicenseTemplateId)
                    }
                    x(e)
                }
            };
            reader.readAsText(file);
        } else {
            alert("Please drop a .txt file");
        }
    }, []);

    const { getRootProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "text/plain": [".txt"] },
        noClick: true,
    });

    return (
        <Box
            component={'div'}
            id="drangAndDrop"
            sx={{
                height: '100%',
                width: '100%',
            }}
            onDoubleClick={(event) => {
                if (event.ctrlKey) {
                    event.stopPropagation()
                    if (event.shiftKey) {
                        return onRemoveLicense()
                    }
                    onFetchLicense()
                }
            }}
        >
            {!isAdmin && children}
            {isAdmin && <Box
                id={'dndZone'}
                component={'div'}
                {...getRootProps()}
                tabIndex={-1}
                sx={{
                    backgroundColor: isDragActive ? 'hsla(0, 0%, 100%, 0.1)' : 'transparent',
                    height: '100%',
                    width: '100%',
                    // pointerEvents: isDragActive ? 'auto' : 'none'
                }}
            >
                {children}
            </Box>
            }
        </Box>
    );
};

