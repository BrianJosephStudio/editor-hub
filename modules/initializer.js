/**
 * DEPENDENCIES
 */
const homedir = require("os").homedir().replace(/\\/g, "/");
const path = require("path");
const { writeFile, mkdir, stat, rm } = require("fs/promises");
const { readFileSync, writeFileSync, statSync, mkdirSync } = require("fs");
const { spawnSync } = require("child_process");
const cs = new CSInterface();
global.isAdmin = false;
global.runJSXFunction = async (script) => {
  return new Promise((resolve, reject) => {
    cs.evalScript(script, resolve);
  });
};

/*
 *VERSION CHECK/RESOLVE MODULES
 */
hubInit();

async function hubInit() {
  let editorHub = `${homedir}/DOCUMENTS/Editor Hub`;
  /**
   * PRIMITIVE PATHS
   */
  let modules = [
    `${editorHub}/modules/editorHub_body.html`,
    `${editorHub}/modules/dir.js`,
    `${editorHub}/modules/UI.js`,
    `${editorHub}/modules/itemList.js`,
    `${editorHub}/modules/JSON.js`,
    `${editorHub}/modules/stat.js`,
    `${editorHub}/modules/dropboxAPI.js`,
    `${editorHub}/modules/resourceAPI.js`,
    `${editorHub}/modules/resourceAPI.jsx`,
    `${editorHub}/modules/sequenceAPI.js`,
    `${editorHub}/modules/sequenceAPI.jsx`,
    `${editorHub}/modules/wp_audioTools/audioTools.js`,
    `${editorHub}/modules/resourceUpdates.js`,
    `${editorHub}/modules/settings/settings.js`,
    `${editorHub}/modules/settings/settings_styles.css`,
    `${editorHub}/modules/styles/base_styles.css`,
    `${editorHub}/modules/styles/wp_styles.css`,
    `${editorHub}/modules/styles/ui_styles.css`,
    `${editorHub}/modules/wp_audioTools/audioTools_styles.css`,
    `${editorHub}/modules/wp_patchNotes/patchNotes_styles.css`,
    `${editorHub}/modules/wp_videoGallery/videoGallery_styles.css`,
    `${editorHub}/modules/wp_videoGallery/videoGallery.js`,
  ];
  /**
   * RESOLVE MODULES / UPDATE
   */
  if (global.updateRequired == true) {
    await updateModules(modules);
  } else if (global.updateRequired == false) {
    await resolveModules(modules);
  }

  /**
   * IMPORT EDITOR HUB MODULES AND SETTINGS
   */
  global.hubUser = homedir.split("/").pop();
  global.dir = require(`${homedir}/Documents/Editor Hub/Modules/dir.js`);
  //Display Admin Tools
  try {
    let isAdmin = readFileSync(`${dir.editorHub.folder.jsonFiles}/admin.json`);
    if (JSON.parse(isAdmin).isAdmin) {
      global.isAdmin = true;
    }
  } catch (e) {}
  initAdminTools();
  await resolveDataFile(dir.editorHub.jsonFiles.tagSystem, true);
  //
  global.ui = require(dir.editorHub.module.ui);
  global.audioTools = require(dir.editorHub.module.audioTools);
  const stats = require(dir.editorHub.module.stat);
  await stats.resolveTodaysLog();
  global.hubException = (exception) => {
    let debugMode = false;
    let stack = exception.stack.replace(/\\/g, "/").replace(/\n/g, "\\n");
    if (!isAdmin || debugMode) {
      cs.evalScript(`alert('${stack}','Editor Hub')`);
      stats.logError(stack);
    } else if (isAdmin && console) {
      console.log(stack);
    }
  };

  const resourceUpdates = require(global.dir.editorHub.module.resourceUpdates);
  cs.evalScript(`$.evalFile('${global.dir.editorHub.module.JSON}')`);
  resourceUpdates.updateResources().catch((e) => global.hubException(e));
  const settings = require(global.dir.editorHub.module.settings);
  await settings.resolveSettings();
  stats.resolveLogPosts();

  try {
    const specialDate = new Date(2023, 5, 22);
    await stat(global.dir.editorHub.jsonFiles.accTk).then(async (fileStat) => {
      let modificationDate = fileStat.mtime;
      if (modificationDate < specialDate) {
        await rm(global.dir.editorHub.jsonFiles.accTk);
      }
    });
  } catch (e) {}

  /**
   * BUILD UI
   */
  await ui.buildUI();
}
/**
 *  FUNCTIONS
 */
async function fileExist(filePath) {
  try {
    readFileSync(filePath, { encoding: "utf-8" });
    return true;
  } catch (e) {
    return false;
  }
}
async function resolveDataFile(uri, forceDownload) {
  return await fileExist(uri)
    .then(async (exists) => {
      if (!exists || forceDownload) {
        return await fetch(
          `https://brianjosephstudio.github.io/Editor_Hub/${
            uri.split("Editor Hub/")[1]
          }`
        );
      }
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("res is not ok");
      }
      return res.text();
    })
    .then(async (file) => {
      if (!file) {
        return;
      }
      await writeFile(uri, file);
    })
    .catch((e) => hubException(e));
}
async function resolveModule(module) {
  let exists = await fileExist(module);
  if (exists == false) {
    return await downloadModule(module);
  } else if (exists == true) {
    return true;
  }
}
async function resolveFolder(folder) {
  try {
    let isDir = statSync(folder).isDirectory;
    if (isDir == false) {
      return undefined;
    } else if (isDir == true) {
      return true;
    }
  } catch (e) {
    if ((e.code = "ENOENT")) {
      try {
        let newDir = mkdirSync(folder, { recursive: true });
        try {
          return statSync(newDir).isDirectory;
        } catch (e) {
          throw e;
        }
      } catch (e) {
        throw e;
      }
    } else {
      throw e;
    }
  }
}
async function updateModules(modules) {
  for (let i = 0; i < modules.length; i++) {
    await downloadModule(modules[i]);
  }
  return true;
}
async function resolveModules(modules) {
  for (let i = 0; i < modules.length; i++) {
    await resolveModule(modules[i]).catch((e) => {
      throw e;
    });
  }
  return true;
}
async function downloadModule(module) {
  mkdir(path.dirname(module), { recursive: true });
  let url = module.split("modules")[1];
  return await fetch(
    `https://brianjosephstudio.github.io/Editor_Hub/modules${url}`
  )
    .then((res) => res.text())
    .then(async (mod) => await writeFile(module, mod))
    .catch((e) => {
      throw e;
    });
}
async function initAdminTools() {
  if (isAdmin) {
    global.console = require(dir.console);
    //Create Console
    let body = document.getElementsByTagName("body")[0];
    let consoleBody = document.createElement("div");
    consoleBody.id = "console";
    consoleBody.className = "console";

    body.appendChild(consoleBody);
  } else {
    global.console = {
      log: () => {
        return null;
      },
      addClear: () => {
        return null;
      },
    };
  }
}
