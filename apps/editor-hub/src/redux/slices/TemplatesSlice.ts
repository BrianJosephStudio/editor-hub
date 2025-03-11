import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeNode } from '../../types/app';

interface TemplatesState {
    mapOverviews?: FileTreeNode;
    agentIcon?: FileTreeNode;
    tierList?: FileTreeNode;
    topBanner?: FileTreeNode;
    agentStatsTable?: FileTreeNode;
    callToAction1?: FileTreeNode;
    contentCreatorTag?: FileTreeNode;
    globalTopicReference?: FileTreeNode;
    introScreen?: FileTreeNode;
    outroScreen?: FileTreeNode;
    scWatermark?: FileTreeNode;
    topicDisplay?: FileTreeNode;
    topicTitle?: FileTreeNode;
}

const initialState: TemplatesState = {
    mapOverviews: undefined,
    agentIcon: undefined,
    tierList: undefined,
    topBanner: undefined,
    agentStatsTable: undefined,
    callToAction1: undefined,
    contentCreatorTag: undefined,
    globalTopicReference: undefined,
    introScreen: undefined,
    outroScreen: undefined,
    scWatermark: undefined,
    topicDisplay: undefined,
    topicTitle: undefined,

};

const templatesSettingsSlice = createSlice({
    name: 'file tree',
    initialState,
    reducers: {
        setMapOverviews(state, action: PayloadAction<FileTreeNode>) {
            state.mapOverviews = action.payload
        },
        setAgentIcon(state, action: PayloadAction<FileTreeNode>) {
            state.agentIcon = action.payload
        },
        setTierList(state, action: PayloadAction<FileTreeNode>) {
            state.tierList = action.payload
        },
        setTopBanner(state, action: PayloadAction<FileTreeNode>) {
            state.topBanner = action.payload
        },
        setAgentStatsTable(state, action: PayloadAction<FileTreeNode>) {
            state.agentStatsTable = action.payload
        },
        setCallToAction1(state, action: PayloadAction<FileTreeNode>) {
            state.callToAction1 = action.payload
        },
        setContentCreatorTag(state, action: PayloadAction<FileTreeNode>) {
            state.contentCreatorTag = action.payload
        },
        setGlobalTopicReference(state, action: PayloadAction<FileTreeNode>) {
            state.globalTopicReference = action.payload
        },
        setIntroScreen(state, action: PayloadAction<FileTreeNode>) {
            state.introScreen = action.payload
        },
        setOutroScreen(state, action: PayloadAction<FileTreeNode>) {
            state.outroScreen = action.payload
        },
        setScWatermark(state, action: PayloadAction<FileTreeNode>) {
            state.scWatermark = action.payload
        },
        setTopicDisplay(state, action: PayloadAction<FileTreeNode>) {
            state.topicDisplay = action.payload
        },
        setTopicTitle(state, action: PayloadAction<FileTreeNode>) {
            state.topicTitle = action.payload
        },
    },
});

export const {
    setMapOverviews,
    setAgentIcon,
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
    setTopicTitle, } = templatesSettingsSlice.actions;

export default templatesSettingsSlice.reducer;
