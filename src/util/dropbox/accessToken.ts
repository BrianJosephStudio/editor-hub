import axios from "axios";
import { readFile, stat, writeFile } from "fs/promises";
import path from "path";

export interface AccessToken {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

const {
  REFRESH_TOKEN: refresh_token,
  CLIENT_ID: client_id,
  CLIENT_SECRET: client_secret
} = process.env

if (
  !refresh_token ||
  !client_id ||
  !client_secret
) {
  throw new Error("There are missing .Env variables")
}

const accessTokenPath = path.resolve(__dirname, "access_token.json")

export const AccessToken = async (): Promise<void> => {
  try {
    const isValid = await checkAccessToken()
    if (isValid) { return }

    const accessToken = JSON.stringify(
      await generateToken()
    )

    await writeFile(accessTokenPath, accessToken);
  } catch (e) {
    console.error(e)
    throw e;
  }
}

export const generateToken = async (): Promise<AccessToken> => {
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token as string,
      client_id: client_id,
      client_secret: client_secret,
    })

    const url = `https://api.dropbox.com/oauth2/token`
    const { data } = await axios.post(url, body)
    //TODO:validate AccessToken format
    return data
  } catch (e) {
    console.error(e)
    throw e
  }
}

const checkAccessToken = async () => {
  try {
    const fileStats = await stat(accessTokenPath);
    const currentTime = new Date().getTime();
    const fileModifiedTime = fileStats.mtime.getTime();
    const timeDifference = currentTime - fileModifiedTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

    return hoursDifference < 3;
  } catch (e) {
    return false;
  }
}

export const getAccessToken = async (): Promise<AccessToken> => {
  const fileData = await readFile(accessTokenPath, {
    encoding: "utf-8",
  })
  return JSON.parse(fileData);
}

