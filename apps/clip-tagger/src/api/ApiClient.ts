import ApiClient from "@editor-hub/api-sdk";

const apiHost = import.meta.env.VITE_API_HOST as string;
const tagTemplateId = import.meta.env.VITE_TAG_TEMPLATE_ID as string;

if (!apiHost || !tagTemplateId) throw new Error("Missing envs");

export default new ApiClient(apiHost, tagTemplateId)