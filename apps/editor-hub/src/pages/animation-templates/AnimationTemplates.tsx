
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material"
import { useState } from "react";
import { NodeWrapper } from "@/business-logic/node.wrapper";
import { Resource } from "@/business-logic/Resource";
import { FileTreeNode } from "@/types/app";
import { useSettings } from "@/contexts/Settings.context";
import { Download } from "lucide-react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { templates } from "@/config/templates.config";

const node = new NodeWrapper()

export const AnimationTemplates = () => {
    const { downloadLocation } = useSettings()
    const templateFileTreeNodes = useSelector((state: RootState) => state.templates);


    const onDownload = async (template: FileTreeNode | undefined, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
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
        <Box className="flex flex-col h-full items-center">
            {/* <TemplateNavigationMenu></TemplateNavigationMenu> */}
            {/* <MapOverviews></MapOverviews> */}
            <Stack className="flex flex-col items-end">
                {templates.map(template => {
                    const [isLoading, setIsLoading] = useState<boolean>(false);
                    const entries = Object.entries(templateFileTreeNodes)
                    let fileTreeNode: FileTreeNode | undefined
                    entries.find(([key, value]) => {
                        if (key === template.propName) fileTreeNode = value
                    })
                    return (
                        <Typography>
                            {template.name}
                            <Button id="import-template-button" onClick={(() => onDownload(fileTreeNode, setIsLoading))}>
                                {isLoading && <CircularProgress size={20}/>}
                                {!isLoading && <Download size={20}/>}
                            </Button>
                        </Typography>
                    )
                })}
            </Stack>
        </Box>

    )
}