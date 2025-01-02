import { Request, Response } from "express";
import axios from "axios";
import { createFolder, listFolders } from "./dropbox";
import config from "../util/config";
import moment from "moment";
import { ProjectData, ProjectType } from "../types/ProjectManager";

const closedFolderRegex = /^\(S?\d.*?\s-\sS?\d.*?\)\s\w.*?\s\w.*?$/;
const openFolderRegex = /^\(S?\d.*?\s-\s\)\s\w.*?\s\w.*?$/;

export const getBaseProjectFolders = async () => {
  return await listFolders(config.valorantVideosRootFolder);
};

export const getFolderArray = async () => {
  try {
    const baseProjectFolders = await getBaseProjectFolders();

    if (baseProjectFolders) {
      //@ts-ignore
      return baseProjectFolders.entries.map(() => {});
    }
  } catch (e) {
    console.error(e);
  }
};

export const getProjectFolderObjectByDate = async () => {
  try {
    const targetFolderDataName = moment().format("MMMM YYYY");

    const baseProjectFolders = await getBaseProjectFolders();
    if (!baseProjectFolders) return;

    return baseProjectFolders.find((entry: any) =>
      entry.name.includes(targetFolderDataName)
    );
  } catch (e) {
    console.error(e);
  }
};

export const doesProjectPathByDateExist = async () => {
  const targetProjectPath = await getProjectFolderObjectByDate();
  if (targetProjectPath[".tag"] && targetProjectPath[".tag"] === "folder") {
    return true;
  }
  return false;
};
export const isProjectMonthFolderClosed = (projectFolderName: string) => {
  const isOpen = openFolderRegex.test(projectFolderName);
  if (isOpen) return false;

  const isClosed = closedFolderRegex.test(projectFolderName);
  if (!isClosed) throw new Error("incoherent regex result");
  return true;
};

export const closeProjectFolderByDate = async () => {};
export const createBaseProjectFolderByDate = async (
  projectData: ProjectData
) => {
  try {
    const targetFoldernameDate = moment().format("MMMM YYYY");
    const projectId = `${
      projectData.projectType === ProjectType.SHORT ? "S" : ""
    }${projectData.projectNumber}`;
    const targetFolderName = `(${projectId} - ) ${targetFoldernameDate}`;
    const targetFolderPath = `${config.valorantVideosRootFolder}/${targetFolderName}`;

    const { data } = await createFolder(targetFolderPath);
    return data.metadata.path_display;
  } catch (e) {
    console.error(e);
  }
};

export const createProjectFolder = async (
  req: Request<{}, {}, ProjectData>,
  res: Response
) => {
  try {
    const { projectName, projectNumber, projectType } = req.body;

    const createFoldersurl =
      "https://api.dropboxapi.com/2/files/create_folder_batch";
    const getFolderLinkUrl =
      "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";
    const createFileRequestUrl =
      "https://api.dropboxapi.com/2/file_requests/create";

    const projectId = `${
      projectType === ProjectType.SHORT ? "S" : ""
    }${projectNumber}`;
    const rootProjectFolderName = `${projectId} - ${projectName}`;
    const uploadsFolderName = `File Requests`;
    const rootProjectFolderPath = `${config.valorantVideosRootFolder}/${rootProjectFolderName}`;
    const uploadsFolderPath = `${rootProjectFolderPath}/${uploadsFolderName}`;

    const headers = {
      Authorization: req.headers.Authorization,
    };

    const createRequestBody = {
      paths: [rootProjectFolderPath, uploadsFolderPath],
    };

    await axios.post(createFoldersurl, createRequestBody, { headers });

    const getFolderLInkBody = {
      path: rootProjectFolderPath,
    };
    const createFileRequestBody = {
      title: rootProjectFolderName,
      destination: uploadsFolderPath,
    };

    const { data: getFolderLinkData } = await axios.post(
      getFolderLinkUrl,
      getFolderLInkBody,
      { headers }
    );
    const { data: createRequestFileData } = await axios.post(
      createFileRequestUrl,
      createFileRequestBody,
      { headers }
    );

    const uploadLink = createRequestFileData.url;
    const projectLink = getFolderLinkData.url;

    const response = {
      projectLink,
      uploadLink,
    };
    res.json(response);
  } catch (e) {
    console.error(e);
  }
};
