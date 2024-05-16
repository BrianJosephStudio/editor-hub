import { getAccessToken } from "../util/dropbox/accessToken"
import {
    DropboxFile,
    ListFolderResponse,
    GetTagsResponse,
    GetTemporaryLinkResponse
} from "../types/Dropbox";
import axios from 'axios';

let abortController: AbortController;

const root = '/BrianJosephStudio.github.io/Editor_Hub'
export const dropboxPath = {
    editorHub: {
        folder: {
            modules: {
                root: `${root}/modules`,
                wp_audioTools: `${root}/modules/wp_audioTools`,
                wp_videoGallery: `${root}/modules/wp_videoGallery`,
                wp_patchNotes: `${root}/modules/wp_patchNotes`,
            },
            jsonFiles: `${root}/jsonFiles`,
            stats: `${root}/stats`,
            templates: `${root}/templates`,
            resources: {
                root: `${root}/resources`,
                image: `${root}/resources/image`,
                video: `${root}/resources/video`,
                music: `${root}/resources/music`,
                sfx: `${root}/resources/sfx`,
                ui: `${root}/resources/ui`,
            },
            styles: `${root}/modules/styles`,
        },
    },
}

export const download = async (dropboxPath: string): Promise<DropboxFile> => {
    try {
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();
        const { signal } = abortController;

        const { access_token } = await getAccessToken();

        const url = "https://content.dropboxapi.com/2/files/download"
        const body = {
            Authorization: `Bearer ${access_token}`,
            "Dropbox-API-Arg": `{"path":"${dropboxPath}"}`,
        }

        const { data } = await axios.post<DropboxFile>(url, body, { signal })

        return data
    } catch (e) {
        console.error(e)
        throw e
    }
}

export const temporaryLink = async (dropboxPath: string): Promise<string> => {
    try {
        const { access_token } = await getAccessToken();

        const url = 'https://api.dropboxapi.com/2/files/get_temporary_link'
        const headers = {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        }
        const body = {
            path: dropboxPath,
        }

        const { data: { link } } = await axios.post<GetTemporaryLinkResponse>(url, body, { headers });

        return link;

    } catch (e) {
        console.error(e);
        throw e;
    };
}

export const streamAudio = async (dropboxPath: string): Promise<ArrayBuffer> => {
    try {
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();
        const { signal } = abortController;

        const { access_token } = await getAccessToken()

        const url = "https://content.dropboxapi.com/2/files/download";
        const headers = {
            Authorization: `Bearer ${access_token}`,
            "Dropbox-API-Arg": JSON.stringify({
                path: dropboxPath
            }),
        };

        const { data } = await axios.post<ArrayBuffer>(url, null, {
            headers: headers,
            responseType: 'arraybuffer',
            signal: signal,
        });

        return data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const getFiles = async (dropboxPath: string): Promise<DropboxFile[]> => {
    try {
        const { access_token } = await getAccessToken()

        const url = "https://api.dropboxapi.com/2/files/list_folder"
        const headers = {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        }
        const body = {
            include_deleted: false,
            include_has_explicit_shared_members: false,
            include_media_info: false,
            include_mounted_folders: true,
            include_non_downloadable_files: false,
            path: dropboxPath,
            recursive: false,
        }

        const { data: { entries } } = await axios.post<ListFolderResponse>(url, body, { headers })

        entries.sort((entryA: DropboxFile, entryB: DropboxFile) => {
            const fileNameA = entryA.path_display.split("/").pop() as string;
            const fileNameB = entryB.path_display.split("/").pop() as string;

            return fileNameA.localeCompare(fileNameB);
        });

        return entries;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export const upload = async (fileData: unknown, dropboxPath: string) => {
    try {
        const { access_token } = await getAccessToken()

        const url = "https://content.dropboxapi.com/2/files/upload"
        const headers = {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/octet-stream",
            "Dropbox-API-Arg": JSON.stringify({
                path: dropboxPath,
                mode: "add",
                autorename: false,
                mute: false,
            }),
        }

        return await axios.post(url, fileData, { headers });
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const getTags = async (dropboxPaths: string[]) => {
    try {
        const { access_token } = await getAccessToken()

        const url = "https://api.dropboxapi.com/2/files/tags/get"
        const headers = {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        }
        const body = {
            paths: dropboxPaths,
        }

        const { data: { paths_to_tags } } = await axios.post<GetTagsResponse>(url, body, { headers })

        return paths_to_tags
    } catch (e) {
        console.error(e)
        throw e
    }
};