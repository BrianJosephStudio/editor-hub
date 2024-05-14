const { readFile, mkdir, writeFile } = require("fs/promises");
const path = require("path");
const cs = new CSInterface();
const dropbox = require(global.dir.editorHub.module.dropboxAPI);
const sequence = require(global.dir.editorHub.module.sequenceAPI);
// const valorant = require(global.dir.editorHub.module.valAPI);
cs.evalScript(`$.evalFile('${global.dir.editorHub.module.resourceAPIjsx}')`);
/** RESOURCE CLASS
 * @param {string} dropboxPath The dropbox path for the target resource file.
 * @returns A Resource Object
 */
class Resource {
  constructor(dropboxPath) {
    let pathSplit = dropboxPath.split("/");
    let pathUri = dropboxPath.split("editor_hub")[1];

    this.saveName = pathSplit[pathSplit.length - 1];
    this.description = `animHub_resource_${dropboxPath}`;
    this.targetBin = pathSplit[pathSplit.indexOf("resources") + 1].replace(
      /\b\w/g,
      function (l) {
        return l.toUpperCase();
      }
    );
    this.binDescription = `animHub_bin_${
      pathSplit[pathSplit.indexOf("resources") + 1]
    }`;
    this.uri = `${global.dir.editorHub.root}${pathUri}`;
    this.dropboxPath = dropboxPath;
  }
}
/**
 * Resolves a resource in the system, then checks if the resource already exists in the project, and finally imports it if it doesn't.
 * @param {resource_object} resource The resource object for the resource to be imported.
 * @param {string} API "valorant" | "dropbox" (The target API from which to download the resource)
 * @returns {projectItem} a projectItem Object
 */
async function importResource(resource, API, settingsGroup, bufferArray) {
  return await resolveResource(resource, API, settingsGroup, bufferArray)
    .then(async (targetUri) => {
      if (targetUri) {
        let script = `importResource('${targetUri}','${resource.targetBin}','${resource.binDescription}','${resource.description}')`;
        return await runJSXFunction(script);
      } else {
        throw global.hubException(new Error("Could not resolve Resource"));
      }
    })
    .then((jsxResult) => {
      return resource;
    });
}
/**
 * Searches a resource in the system and downloads it if it doesn't find it.
 * @param {resource_object} resource The resource object to be resolved.
 * @param {String} API "valorant" | "dropbox" (The target API from which to download the resource)
 * @returns {Boolean} true | false
 */
async function resolveResource(resource, API, settingsGroup, bufferArray) {
  let targetUri;
  let targetFolder;
  if (
    settingsGroup &&
    settingsGroup.importFromProjectFolder.currentValue == 0
  ) {
    let projectPath = path.dirname(await runJSXFunction(`getProjectPath()`));
    projectPath = projectPath.replace(/\\/g, "/");
    let hubDirName = "Editor Hub Resources";
    let resourcesFolder = global.dir.findDir(projectPath, hubDirName);

    if (!resourcesFolder) {
      targetFolder = `${projectPath}/${hubDirName}/${path.basename(
        path.dirname(resource.uri)
      )}`;
    } else {
      targetFolder = `${resourcesFolder}/${path.basename(
        path.dirname(resource.uri)
      )}`;
    }
    try {
      await mkdir(targetFolder, { recursive: true });
    } catch (e) {
      targetFolder = path.dirname(resource.uri);
      global.hubException(
        new Error(
          "Access to project folder was denied, your file will be imported into the Editor HUb Resources folder instead. Please change your 'Move files to project folder before import' settings to avoid seeing this message again."
        )
      );
    }

    targetUri = `${targetFolder}/${path.basename(resource.uri)}`;
  } else if (
    !settingsGroup ||
    settingsGroup.importFromProjectFolder.currentValue == 1
  ) {
    targetFolder = path.dirname(resource.uri);
    targetUri = resource.uri;
  }
  await mkdir(targetFolder, { recursive: true });
  return await readFile(targetUri)
    .then(() => {
      return targetUri;
    })
    .catch(async (e) => {
      if (e.code == "ENOENT" && bufferArray) {
        for (let item of bufferArray) {
          if (item.dropboxPath == resource.dropboxPath) {
            console.log(
              "about to write down from buffer array \nresourceAPI:107"
            );
            await writeFile(targetUri, item.fileBuffer, null);
            cs.evalScript(
              `setDescription(File('${targetUri}'),'${resource.description}')`
            );
            return targetUri;
          }
        }
      }
      if (e.code == "ENOENT" && API == "valorant") {
        // await valorant.download(resource.uri,resource.url);
        return true;
      } else if (e.code == "ENOENT" && API == "dropbox") {
        let myDownload = await dropbox.download(
          targetUri,
          resource.dropboxPath
        );
        if (myDownload != true) {
          throw new Error("Dropbox Download returned false");
        }
        cs.evalScript(
          `setDescription(File('${targetUri}'),'${resource.description}')`
        );
        return targetUri;
      } else {
        return null;
      }
    })
    .catch((e) => global.hubException(e));
}
async function placeResource(resource, trackData) {
  await sequence.resolveHubTrack(JSON.stringify(trackData));
  cs.evalScript(
    `placeResource('${resource.targetBin}','${resource.binDescription}','${
      resource.description
    }','${JSON.stringify(trackData)}')`,
    (result) => {
      if (result == false || trackData.trackTitle == "sfx") {
        return null;
      }
      cs.focusPanel("timeline");
    }
  );
}
// async function runJSXFunction(script){
//     return new Promise((resolve,reject) => {
//         cs.evalScript(script,resolve)
//     })
// }
module.exports = { Resource, importResource, resolveResource, placeResource };
