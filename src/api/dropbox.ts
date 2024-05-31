import { getAccessToken } from "../util/dropbox/accessToken"
import { createDropboxProxy } from '../util/middleware/dropboxProxy'
import { Request, Response, NextFunction } from "express";
import { ProjectData, ProjectType } from "../types/ProjectManager.d";
import axios from "axios";

export const addAuthorizationHeader = async (req: Request, _res: Response, next: NextFunction) => {
    const { access_token } = await getAccessToken();

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

export const getProjectPathByDate = () => {}
export const doesProjectPathByDateExistp = () => {}
export const isProjectPathByMonthClosed  = () => {} //returns whether the folder is closed and also whether it needs to be closed
export const closeProjectFolderByDate = () => {}
export const createProjectFolderByDate = () => {}

export const createProjectFolder = async (req: Request<{}, {}, ProjectData>, res: Response) => {
    try {
        const { projectName, projectNumber, projectType } = req.body

        const createFoldersurl = 'https://api.dropboxapi.com/2/files/create_folder_batch'
        const getFolderLinkUrl = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings'
        const createFileRequestUrl = 'https://api.dropboxapi.com/2/file_requests/create'

        const rootFolder = "Guides"

        const projectId = `${projectType === ProjectType.SHORT ? "S" : ""}${projectNumber}`
        const rootProjectFolderName = `${projectId} - ${projectName}`
        const uploadsFolderName = `File Requests`
        const rootProjectFolderPath = `/${rootFolder}/${rootProjectFolderName}`
        const uploadsFolderPath = `${rootProjectFolderPath}/${uploadsFolderName}`

        const headers = {
            Authorization: req.headers.Authorization
        }

        const createRequestBody = {
            paths: [
                rootProjectFolderPath,
                uploadsFolderPath,
            ]
        }

        await axios.post(createFoldersurl, createRequestBody, { headers })
        
        const getFolderLInkBody = {
            path: rootProjectFolderPath
        }
        const createFileRequestBody = {
            title: rootProjectFolderName,
            destination: uploadsFolderPath
        }
        
        const { data: getFolderLinkData } = await axios.post(getFolderLinkUrl, getFolderLInkBody, { headers })
        const { data: createRequestFileData } = await axios.post(createFileRequestUrl, createFileRequestBody, { headers })

        
        
        const uploadLink = createRequestFileData.url
        const projectLink = getFolderLinkData.url

        const response = {
            projectLink,
            uploadLink
        }
        res.json(response)
    } catch (e) {
        console.error(e)
    }
}