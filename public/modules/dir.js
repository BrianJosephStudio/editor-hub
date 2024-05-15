const homedir = require("os").homedir().replace(/\\/g, "/");
const path = require("path");
const { readdirSync, statSync } = require("fs");
const { stat } = require("fs/promises");
/*
 *EDITOR HUB SYSTEM PATHS
 */
const editorHub = {
  root: `${homedir}/DOCUMENTS/Editor Hub`,
  folder: {
    modules: {
      root: `${homedir}/DOCUMENTS/Editor Hub/modules`,
      wp_audioTools: `${homedir}/DOCUMENTS/Editor Hub/modules/wp_audioTools`,
      wp_videoGallery: `${homedir}/DOCUMENTS/Editor Hub/modules/wp_videoGallery`,
      wp_patchNotes: `${homedir}/DOCUMENTS/Editor Hub/modules/wp_patchNotes`,
      styles: `${homedir}/DOCUMENTS/Editor Hub/modules/styles`,
      settings: `${homedir}/DOCUMENTS/Editor Hub/modules/settings`,
    },
    jsonFiles: `${homedir}/DOCUMENTS/Editor Hub/jsonFiles`,
    templates: `${homedir}/DOCUMENTS/Editor Hub/templates`,
    stats: `${homedir}/DOCUMENTS/Editor Hub/stats`,
    resources: {
      root: `${homedir}/DOCUMENTS/Editor Hub/resources`,
      image: `${homedir}/DOCUMENTS/Editor Hub/resources/image`,
      video: `${homedir}/DOCUMENTS/Editor Hub/resources/video`,
      music: `${homedir}/DOCUMENTS/Editor Hub/resources/music`,
      sfx: `${homedir}/DOCUMENTS/Editor Hub/resources/sfx`,
      ui: `${homedir}/DOCUMENTS/Editor Hub/resources/ui`,
    },
    appData: `${homedir}/AppData/Local/Editor Hub`,
  },
  module: {
    ui: `${homedir}/DOCUMENTS/Editor Hub/modules/UI.js`,
    itemList: `${homedir}/DOCUMENTS/Editor Hub/modules/itemList.js`,
    htmlBody: `${homedir}/DOCUMENTS/Editor Hub/modules/editorHub_body.html`,
    resourceAPI: `${homedir}/DOCUMENTS/Editor Hub/modules/resourceAPI.js`,
    resourceAPIjsx: `${homedir}/DOCUMENTS/Editor Hub/modules/resourceAPI.jsx`,
    sequenceAPI: `${homedir}/DOCUMENTS/Editor Hub/modules/sequenceAPI.js`,
    sequenceAPIjsx: `${homedir}/DOCUMENTS/Editor Hub/modules/sequenceAPI.jsx`,
    dropboxAPI: `${homedir}/DOCUMENTS/Editor Hub/modules/dropboxAPI.js`,
    valAPI: `${homedir}/DOCUMENTS/Editor Hub/modules/valAPI.js`,
    resourceLibrary: `${homedir}/DOCUMENTS/Editor Hub/modules/resourceLibrary.js`,
    resourceUpdates: `${homedir}/DOCUMENTS/Editor Hub/modules/resourceUpdates.js`,
    settings: `${homedir}/DOCUMENTS/Editor Hub/modules/settings/settings.js`,
    audioTools: `${homedir}/DOCUMENTS/Editor Hub/modules/wp_audioTools/audioTools.js`,
    videoGallery: `${homedir}/DOCUMENTS/Editor Hub/modules/wp_videoGallery/videoGallery.js`,
    stat: `${homedir}/DOCUMENTS/Editor Hub/modules/stat.js`,
    JSON: `${homedir}/DOCUMENTS/Editor Hub/modules/JSON.js`,
  },
  jsonFiles: {
    localVersion: `${homedir}/DOCUMENTS/Editor Hub/jsonFiles/localVersion.json`,
    tagSystem: `${homedir}/DOCUMENTS/Editor Hub/jsonFiles/tagSystem.json`,
    accTk: `${homedir}/DOCUMENTS/Editor Hub/jsonFiles/accTk.json`,
  },
  style: {
    base_style: `${homedir}/DOCUMENTS/Editor Hub/modules/styles/base_styles.css`,
    wp_style: `${homedir}/DOCUMENTS/Editor Hub/modules/styles/wp_styles.css`,
    ui_style: `${homedir}/DOCUMENTS/Editor Hub/modules/styles/ui_styles.css`,
    settings_style: `${homedir}/DOCUMENTS/Editor Hub/modules/settings/settings_styles.css`,
    audioTools_style: `${homedir}/DOCUMENTS/Editor Hub/modules/wp_audioTools/audioTools_styles.css`,
    patchNotes_style: `${homedir}/DOCUMENTS/Editor Hub/modules/wp_PatchNotes/patchNotes_styles.css`,
    videoGallery_style: `${homedir}/DOCUMENTS/Editor Hub/modules/wp_videoGallery/videoGallery_styles.css`,
  },
  appData: {
    updateLogs: `${homedir}/AppData/Local/Editor Hub/updateLogs.json`,
    settings: `${homedir}/AppData/Local/Editor Hub/settingsObject.json`,
  },
};
/*
 *ANIMATOR HUB SYSTEM PATHS
 */
const animHub = {
  root: `${homedir}/DOCUMENTS/Animator Hub`,
  folder: {
    components: `${homedir}/DOCUMENTS/Animator Hub/components`,
    templates: `${homedir}/DOCUMENTS/Animator Hub/templates`,
    resources: `${homedir}/DOCUMENTS/Animator Hub/resources`,
    jsonFiles: `${homedir}/DOCUMENTS/Animator Hub/jsonFiles`,
  },
  localVersion: `${homedir}/DOCUMENTS/Animator Hub/jsonFiles/localVersion.txt`,
  appData: `${homedir}/AppData/Local/Animator Hub`,
};
const tutorial = {
  editorHub: {
    songManager: `<iframe width="560" height="315" src="https://www.youtube.com/embed/dlwsX9OXO6U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
    sfxManager: `<iframe width="560" height="315" src="https://www.youtube.com/embed/OlGmySJGmFw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
    audioToolSettings: `<iframe width="560" height="315" src="https://www.youtube.com/embed/Zn3DheWG3nI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
    ingameFootage: `<iframe width="560" height="315" src="https://www.youtube.com/embed/5kBBvGdc89g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
  },
};
const console = `${homedir}/DOCUMENTS/Editor Hub/modules/console.js`;
function findDir(projectFolder, dirName) {
  let files = readdirSync(projectFolder);
  for (let file of files) {
    let filePath = `${projectFolder}/${file}`;
    filePath = filePath.replace(/\\/g, "/");
    let stats = statSync(filePath);

    if (stats.isDirectory()) {
      if (file === dirName) {
        return filePath;
      } else {
        let nestedResult = findDir(filePath, dirName);
        if (nestedResult) {
          return nestedResult;
        }
      }
    }
  }
  return null;
}
module.exports = { editorHub, animHub, console, tutorial, findDir };
