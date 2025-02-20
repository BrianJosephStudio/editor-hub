import axios from "axios";
import { ClipUpload } from "../ClipUploads";
import { UploadCheckResponse, UploadSessionFinishBatchResult, UploadStartBatchResponse } from "@editor-hub/dropbox-types/src/types/dropbox";

export const uploadClips = async (apiHost: string, clipUploads: ClipUpload[]) => {
  const sessionIds = await startUploadSession(apiHost, clipUploads.length)

  clipUploads.forEach((clipUpload, index) => {
    const sessionId = sessionIds[index]
    if (!sessionId) throw 'no sessionId'
    clipUpload.setSessionId(sessionId)
  })

  await appendUploadSession(apiHost, clipUploads)

  return finishUploadSession(apiHost, clipUploads)
};

export const checkClipUploadJob = async (apiHost: string, jobId: string) => {
  const url = `${apiHost}/upload_session/finish_batch/check`
  const body = {
    async_job_id: jobId
  }

  return axios.post<UploadCheckResponse>(url, body)
};

const startUploadSession = async (apiHost: string, numSessions: number) => {
  const urlStart = `${apiHost}/upload_session/start_batch`;
  const body = {
    num_sessions: numSessions
  }
  const headers = {
    "Content-Type": "application/json"
  }

  const { data: { session_ids } } = await axios.post<UploadStartBatchResponse>(urlStart, body, { headers });

  const validResponse = isSessionIds(session_ids)
  if (!validResponse) throw 'invalid response'

  return session_ids
}

const appendUploadSession = async (apiHost: string, clipUploads: ClipUpload[]) => {
  await Promise.all(
    clipUploads.map(async (clipUpload) => {
      const CHUNK_SIZE = 150 * 1024 * 1024;
      const fileSize = clipUpload.file.size;
      const urlAppend = `${apiHost}/upload_session/append_v2`;

      try {
        while (clipUpload.offset < fileSize) {
          const chunk = clipUpload.file.slice(clipUpload.offset, (clipUpload.offset + CHUNK_SIZE > fileSize ? fileSize : clipUpload.offset + CHUNK_SIZE));

          await axios.post(urlAppend, chunk, {
            headers: {
              "Content-Type": "application/octet-stream",
              "Dropbox-API-Arg": JSON.stringify({
                cursor: {
                  session_id: clipUpload.sessionId,
                  offset: clipUpload.offset
                },
                close: clipUpload.offset + CHUNK_SIZE >= fileSize
              })
            }
          });

          clipUpload.setOffset(clipUpload.offset + CHUNK_SIZE);
        }

      } catch (error) {
        console.error("Upload failed:", error);
        throw new Error("Failed to upload clip to Dropbox");
      }
    })
  )
}

const finishUploadSession = (apiHost: string, clipUploads: ClipUpload[]) => {
  const urlFinish = `${apiHost}/upload_session/finish_batch`;
  const entries = clipUploads.map(clipUpload => ({
    commit: {
      autorename: true,
      mode: "add",
      mute: false,
      path: `${clipUpload.uploadPath}/${clipUpload.newClipName ?? 'file_name_error'}`,
      strict_conflict: false
    },
    cursor: {
      offset: clipUpload.file.size,
      session_id: clipUpload.sessionId
    }
  }))

  const body = {
    entries
  }

  const headers = {
    "Content-Type": "application/json",
  }

  return axios.post<UploadSessionFinishBatchResult>(urlFinish, body, { headers });
}

const isSessionIds = (sessionIds: unknown): sessionIds is string[] => {
  if (!sessionIds || !Array.isArray(sessionIds) || sessionIds.some(sessionId => typeof sessionId !== 'string'))
    return false;
  return true
}