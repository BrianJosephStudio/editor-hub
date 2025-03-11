import { templates } from "@/config/templates.config";
import {
    setAgentIcon,
    setMapOverviews,
    setTierList,
    setTopBanner,
    setAgentStatsTable,
    setCallToAction1,
    setContentCreatorTag,
    setGlobalTopicReference,
    setIntroScreen,
    setOutroScreen,
    setScWatermark,
    setTopicDisplay,
    setTopicTitle,
} from "@/redux/slices/TemplatesSlice";
// import { RootState } from "@/redux/store";
import { FileTreeNode } from "@/types/app";
import { createFileTreeNodeFromPath } from "@/util/fileBrowser.util";
import { createContext, useContext, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const templatesRootpath = import.meta.env.VITE_TEMPLATES_ROOT_FOLDER
if (!templatesRootpath) throw new Error("missing envs")

interface TemplatesContextProps {
}

const TemplatesContext = createContext<TemplatesContextProps | undefined>(
    undefined
);

export const useTemplates = () => {
    const context = useContext(TemplatesContext);
    if (!context) {
        throw new Error(
            "useTemplates must be used within a TemplatesProvider"
        );
    }
    return context;
};

export const TemplatesProvider = ({ children }: { children: ReactNode }) => {
    // const { mapOverviews } = useSelector((state: RootState) => state.templates)
    const dispatch = useDispatch();

    const setTemplateState = (fileTreeNode: FileTreeNode, key: string) => {
        switch (key) {
            case "map-overviews":
                dispatch(setMapOverviews(fileTreeNode))
                break;
            case "agent-icon":
                dispatch(setAgentIcon(fileTreeNode))
                break;
            case "tier-list":
                dispatch(setTierList(fileTreeNode))
                break;
            case "top-banner":
                dispatch(setTopBanner(fileTreeNode))
                break;
            case "agent-stats-table":
                dispatch(setAgentStatsTable(fileTreeNode))
                break;
            case "cta1":
                dispatch(setCallToAction1(fileTreeNode))
                break;
            case "content-creator-tag":
                dispatch(setContentCreatorTag(fileTreeNode))
                break;
            case "global-topic-reference":
                dispatch(setGlobalTopicReference(fileTreeNode))
                break;
            case "intro-screen":
                dispatch(setIntroScreen(fileTreeNode))
                break;
            case "outro-screen":
                dispatch(setOutroScreen(fileTreeNode))
                break;
            case "sc-watermark":
                dispatch(setScWatermark(fileTreeNode))
                break;
            case "topic-display":
                dispatch(setTopicDisplay(fileTreeNode))
                break;
            case "topic-title":
                dispatch(setTopicTitle(fileTreeNode))
                break;
        }
    }

    useEffect(() => {
        // if (mapOverviews) return;
        const fetchTemplates = async () => {
            templates.map(async (template) => {
                const fileTreeNode = await createFileTreeNodeFromPath(template.path, templatesRootpath)
                setTemplateState(fileTreeNode, template.key)
            })
        }
        fetchTemplates()
    }, [])

    return (
        <TemplatesContext.Provider
            value={{
            }}
        >
            {children}
        </TemplatesContext.Provider>
    );
};
