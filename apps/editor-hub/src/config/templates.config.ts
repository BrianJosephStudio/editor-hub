const templatesRootpath = import.meta.env.VITE_TEMPLATES_ROOT_FOLDER
if (!templatesRootpath) throw new Error("missing envs")

interface Template {
    name: string
    propName: string
    key: string
    path: string
}

export const mapOverviews: Template = {
    name: 'Map Overviews',
    propName: 'mapOverviews',
    key: 'map-overviews',
    path: `${templatesRootpath}/Map Overviews.aep`
}
export const agentIcon: Template = {
    name: 'Agent Icon',
    propName: 'agentIcon',
    key: 'agent-icon',
    path: `${templatesRootpath}/Agent Icon.aep`
}
export const tierList: Template = {
    name: 'Agent Tier List',
    propName: 'tierList',
    key: 'tier-list',
    path: `${templatesRootpath}/Agent Tier List.aep`
}
export const topBanner: Template = {
    name: 'Top Banner',
    propName: 'topBanner',
    key: 'top-banner',
    path: `${templatesRootpath}/Top Banner.aep`
}
export const agentStatsTable: Template = {
    name: 'Agent Stats Table',
    propName: 'agentStatsTable',
    key: 'agent-stats-table',
    path: `${templatesRootpath}/Agent Stats Table.aep`
}
export const callToAction1: Template = {
    name: 'Call To Action 1',
    propName: 'callToAction1',
    key: 'cta1',
    path: `${templatesRootpath}/callToAction1.aep`
}
export const contentCreatorTag: Template = {
    name: 'Content Creator Tag',
    propName: 'contentCreatorTag',
    key: 'content-creator-tag',
    path: `${templatesRootpath}/Content Creator Tag.aep`
}
export const globalTopicReference: Template = {
    name: 'Global Topic Reference',
    propName: 'globalTopicReference',
    key: 'global-topic-reference',
    path: `${templatesRootpath}/Global Topic Reference.aep`
}
export const introScreen: Template = {
    name: 'Intro Screen',
    propName: 'introScreen',
    key: 'intro-screen',
    path: `${templatesRootpath}/Intro Screen.aep`
}
export const outroScreen: Template = {
    name: 'Outro Screen',
    propName: 'outroScreen',
    key: 'outro-screen',
    path: `${templatesRootpath}/Outro Screen.aep`
}
export const scWatermark: Template = {
    name: 'SC Watermark',
    propName: 'scWatermark',
    key: 'sc-watermark',
    path: `${templatesRootpath}/SC_Watermark.aep`
}
export const topicDisplay: Template = {
    name: 'Topic Display',
    propName: 'topicDisplay',
    key: 'topic-display',
    path: `${templatesRootpath}/Topic Display.aep`
}
export const topicTitle: Template = {
    name: 'Topic Title',
    propName: 'topicTitle',
    key: 'topic-title',
    path: `${templatesRootpath}/Topic Title.aep`
}

export const templates = [
    mapOverviews,
    agentIcon,
    tierList,
    topBanner,
    agentStatsTable,
    callToAction1,
    contentCreatorTag,
    globalTopicReference,
    introScreen,
    outroScreen,
    scWatermark,
    topicDisplay,
    topicTitle,
]