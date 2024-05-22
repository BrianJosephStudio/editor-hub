import { getAccessToken } from "../util/dropbox/accessToken"
import { createDropboxProxy } from '../util/middleware/dropboxProxy'
import { Request, Response, NextFunction } from "express";

export const addAuthorizationHeader = async (req: Request, _res: Response, next: NextFunction) => {
    const { access_token } = await getAccessToken();

    console.log("headers:", req.headers)

    req.headers['Authorization'] = `Bearer ${access_token}`

    next()
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