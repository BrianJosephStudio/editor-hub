import { getAccessToken } from "../util/dropbox/accessToken"
import { createDropboxProxy } from '../util/middleware/dropboxProxy'
import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const addAuthorizationHeader = async (req: Request, _res: Response, next: NextFunction) => {
    const authorizationHeader = await createAuthorizationHeader()

    req.headers['Authorization'] = authorizationHeader

    next()
}
export const createAuthorizationHeader = async (): Promise<string> => {
    const { access_token } = await getAccessToken();

    return `Bearer ${access_token}`
}

export const dropboxContentProxy = async () => {
    try {
        const proxyMiddleware = createDropboxProxy(
            "https://content.dropboxapi.com/2/files"
        )

        return proxyMiddleware
    } catch (e: any) {
        throw e
    }
}

export const dropboxApiProxy = async () => {
    try {
        const proxyMiddleware = createDropboxProxy(
            "https://api.dropboxapi.com/2/files"
        )

        return proxyMiddleware
    } catch (e: any) {
        throw e
    }
}

export const listFolders = async (path: string) => {
    try {
        const authorizationHeader = await createAuthorizationHeader();

        const url = 'https://api.dropboxapi.com/2/files/list_folder';
        const body = { path };
        const headers = {
            Authorization: authorizationHeader,
            "content-type": "application/json"
        };

        let allEntries: any[] = [];
        let hasMore = true;
        let cursor: string | null = null;

        while (hasMore) {
            const response:any = cursor
                ? await axios.post('https://api.dropboxapi.com/2/files/list_folder/continue', { cursor }, { headers })
                : await axios.post(url, body, { headers });

            allEntries = allEntries.concat(response.data.entries);
            hasMore = response.data.has_more;
            cursor = response.data.cursor;
        }

        return allEntries
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const createFolder = async (path: string) => {
    try {
        const authorizationHeader = await createAuthorizationHeader()

        const url = 'https://api.dropboxapi.com/2/files/create_folder_v2'
        const body = { path }
        const headers = {
            Authorization: authorizationHeader,
            "content-type": "application/json"
        }

        const { data } = await axios.post(url, body, { headers })

        return data
    } catch (e) { console.error(e) }
}