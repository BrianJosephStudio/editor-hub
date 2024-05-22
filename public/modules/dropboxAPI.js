const { readFile, writeFile, stat } = require("fs/promises");

let abortController;

const backendApiUrl = `${global.appBackendUrl}/api`

const root = '/BrianJosephStudio.github.io/Editor_Hub'
const dropboxPath = {
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
};

async function download(uri, dropboxPath, returnBuffer) {
  try {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
    const { signal } = abortController;

    const url = `${backendApiUrl}/download`
    const request = {
      method: "post",
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Dropbox-API-Arg': JSON.stringify({ path: dropboxPath })
      }
    }

    const response = await fetch(url, request, { signal })

    if (!response.ok) {
      const body = await response.json()
      throw new Error(
        `Dropbox download request failed: ${body.error_summary}`
      );
    }

    const arrayBuffer = res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (returnBuffer) {
      return buffer;
    }
    await writeFile(uri, buffer, null);
    return true;
  } catch (e) {
    global.hubException(e);
  }
}

/*
async function temporaryLink(dropboxPath) {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const { signal } = abortController;
  return await readFile(global.dir.editorHub.jsonFiles.accTk, {
    encoding: "utf-8",
  })
    .then(async (accTk) => {
      accTk = JSON.parse(accTk).access_token;
      return await fetch("https://content.dropboxapi.com/2/files/download", {
        method: "post",
        headers: {
          Authorization: `Bearer ${accTk}`,
          "Dropbox-API-Arg": JSON.stringify({ path: dropboxPath }),
        },
        signal: signal,
      });
    })
    .then((res) => {
      abortController == null;
      if (!res.ok) {
        throw new Error("something went wrong.");
      }
      return res.blob();
    })
    .catch((e) => {
      if (e.name == "AbortError") {
        abortController == null;
        return null;
      } else {
        console.log(e.message, true);
        global.hubException(e);
      }
    });
}
*/

async function temporaryLink(dropboxPath) {
  try {
    const url = `${backendApiUrl}/get_temporary_link`
    const request = {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dropboxPath })
    }
    const response = await fetch(url, request)

    const body = await response.json()

    if (
      response.status !== 200 ||
      !body.link
    ) {
      throw new Error(body.error_sumamry);
    }

    console.log(`Temporary Link Downloaded | dropboxAPI.js:155`);
    return body.link;
  } catch (e) {
    hubException(e);
    return null;
  }
}

async function streamAudio(audioContext, dropboxPath) {
  try {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
    const { signal } = abortController;

    const url = `${backendApiUrl}/download`
    const request = {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dropboxPath }),
      signal: signal,
    }

    const response = await fetch(url, request)
    if (!response.ok) {
      throw new Error("something went wrong.");
    }

    const arrayBuffer = await response.arrayBuffer()

    let arrayBufferCopy = arrayBuffer.slice();
    let fileBuffer = Buffer.from(arrayBuffer);
    let audioBuffer = await audioContext.decodeAudioData(arrayBufferCopy);
    let bufferObject = {
      audioBuffer: audioBuffer,
      dropboxPath: dropboxPath,
      fileBuffer: fileBuffer,
    };
    return bufferObject;
  } catch (e) {
    if (e.name == "AbortError") {
      abortController == null;
      return null;
    } else {
      global.hubException(e);
    }
  }
}

async function getFiles(dropboxPath) {
  try {
    const url = `${backendApiUrl}/list_folder`
    console.log(url)
    const request = {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: dropboxPath,
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_media_info: false,
        include_mounted_folders: true,
        include_non_downloadable_files: false,
        recursive: false,
      })
    }
    const response = await fetch(url, request)
    const entries = await response.json()

    console.log(JSON.stringify(entries[0]))

    entries.sort((a, b) => {
      const fileNameA = a.path_display.split("/").pop();
      const fileNameB = b.path_display.split("/").pop();
      return fileNameA.localeCompare(fileNameB);
    });
    return entries;
  } catch (e) {
    global.hubException(e);
  }
}

async function upload(fileData, dropboxPath) {
  try {
    const url = `${backendApiUrl}/upload`
    const request = {
      method: "post",
      headers: {
        'Content-Type': 'application/octet-stream',
        "Dropbox-API-Arg": JSON.stringify({
          path: dropboxPath,
          mode: "add",
          autorename: false,
          mute: false,
        }),
      },
      body: fileData
    }
    await fetch(url, request)
  } catch (e) {
    console.log("catch block", e)
    global.hubException(e);
    return false;
  }
}

async function getTags(dropboxPaths) {
  try {
    const url = `${backendApiUrl}/get_tags`
    const request = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dropboxPaths
      }),
    }

    const response = await fetch(url, request)

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text);
    }

    const paths_to_tags = await response.json()
    return paths_to_tags
  } catch (e) {
    hubException(e);
  }
}

module.exports = {
  dropboxPath,
  download,
  getFiles,
  temporaryLink,
  streamAudio,
  upload,
  getTags,
};
