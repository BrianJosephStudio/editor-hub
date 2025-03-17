import { NodeWrapper } from "@/business-logic/node.wrapper";
import { Resource } from "@/business-logic/Resource";
import { useSettings } from "@/contexts/Settings.context";
import { RootState } from "@/redux/store";
import { FileTreeNode } from "@/types/app";
import { Download } from "@mui/icons-material"
import { Box, Button, CircularProgress, Typography } from "@mui/material"
import { useState } from "react";
import { useSelector } from "react-redux";

const node = new NodeWrapper()
export const MapOverviews = () => {
    const { downloadLocation } = useSettings()
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { mapOverviews, agentIcon } = useSelector((state: RootState) => state.templates);

    const onDownload = async (template: FileTreeNode | undefined) => {
        try {
            if (!template) return;
            if (!node.isNodeEnv) return console.log(`Downloaded ${template.name}`);

            setIsLoading(true);

            const resource = await Resource.getInstance(
                template,
                downloadLocation
            );

            await resource.download();
            await resource.import();
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Box component={'div'} className="bg-gray-900 w-full h-full flex flex-col items-center">
            <Typography>
                Map Overviews
                <Button id="import-template-button" onClick={(() => onDownload(mapOverviews))}>
                    {isLoading && <CircularProgress />}
                    {!isLoading && <Download></Download>}
                </Button>
            </Typography>
            <Typography>
                Agent Icon
                <Button id="import-template-button" onClick={(() => onDownload(agentIcon))}>
                    {isLoading && <CircularProgress />}
                    {!isLoading && <Download></Download>}
                </Button>
            </Typography>
        </Box>
    )
}