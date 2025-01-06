import axios from "axios";
import { readFile, stat, writeFile } from "fs/promises";
import path from "path";

export interface AccessToken {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
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

    console.log(accessToken)

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
    console.log("generateToken response", data)
    //TODO:validate AccessToken format
    return data
  } catch (e) {
    console.error(e)
    throw e
  }
}

const isValidAccessToken = (obj: any): obj is AccessToken => {
  return (
    typeof obj.access_token === 'string' &&
    typeof obj.token_type === 'string' &&
    typeof obj.expires_in === 'number'
  );
};

// Function to check the access token
const checkAccessToken = async (): Promise<boolean> => {
  try {
    // Read the file content
    const fileContent = await readFile(accessTokenPath, 'utf-8');
    // Parse the JSON
    const accessToken: any = JSON.parse(fileContent);

    // Validate the JSON against the AccessToken interface
    if (!isValidAccessToken(accessToken)) {
      throw new Error('Invalid access token format');
    }

    // Check if the token is expired
    const currentTime = Math.floor(new Date().getTime() / 1000); // current time in seconds
    const fileStats = await stat(accessTokenPath);
    const fileModifiedTime = Math.floor(fileStats.mtime.getTime() / 1000); // file modified time in seconds

    const tokenAge = currentTime - fileModifiedTime; // age of the token in seconds

    return tokenAge < accessToken.expires_in;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getAccessToken = async (): Promise<AccessToken> => {
  await AccessToken()
  const fileData = await readFile(accessTokenPath, {
    encoding: "utf-8",
  })

  return JSON.parse(fileData);
}

