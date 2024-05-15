const {
  readFile,
  writeFile,
  readdir,
  rm,
  mkdir,
  stat,
} = require("fs/promises");
const path = require("path");
const cs = new CSInterface();
const stats = require(dir.editorHub.module.stat);
const defaultSettings = {
  videoGallery: {
    playerVolume: {
      type: "slider",
      id: "playerVolume",
      name: "Video player default volume",
      currentValue: 0.3,
      defaultValue: 0.3,
      valueRange: [0, 1, 0.01],
    },
    importFromProjectFolder: {
      type: "dropdown",
      id: "importFromProjectFolder",
      name: "Download Footage in:",
      currentValue: 0,
      defaultValue: 0,
      valueArray: [
        { value: "Project's Folder", input: null },
        { value: "Editor Hub Resources", input: null },
      ],
    },
  },
  audioTools: {
    playerVolume: {
      type: "slider",
      id: "playerVolume",
      name: "Audio player default volume",
      currentValue: 0.3,
      defaultValue: 0.3,
      valueRange: [0, 1, 0.01], //min, max, step
    },
    importFromProjectFolder: {
      type: "dropdown",
      id: "importFromProjectFolder",
      name: "Download audio files in:",
      currentValue: 0,
      defaultValue: 0,
      valueArray: [
        { value: "Project's Folder", input: null },
        { value: "Editor Hub Resources", input: null },
      ],
    },
    insertMode: {
      type: "dropdown",
      id: "insertMode",
      name: "Insertion Mode",
      currentValue: 0,
      defaultValue: 0,
      valueArray: [
        { value: "Non-destructive", input: null },
        { value: "Destructive", input: null },
      ],
    },
    trackLayout: {
      type: "trackLayout",
      id: "trackLayout",
      name: "Hub Tracks Layout",
      currentArray: [
        {
          trackId: 0,
          trackName: "VO",
          trackTitle: "vo",
          keyBind: { key: null, ctrl: false, shift: false, alt: false },
          trackNumber: 1,
        },
        {
          trackId: 1,
          trackName: "Hub_SFX",
          trackTitle: "sfx",
          keyBind: { key: "1", ctrl: true, shift: false, alt: false },
          trackNumber: 2,
        },
        {
          trackId: 2,
          trackName: "Hub_Music",
          trackTitle: "music",
          keyBind: { key: "Enter", ctrl: true, shift: false, alt: false },
          trackNumber: 3,
        },
        {
          trackId: 3,
          trackName: "Hub_SFX2",
          trackTitle: "sfx",
          keyBind: { key: "2", ctrl: true, shift: false, alt: false },
          trackNumber: 4,
        },
        {
          trackId: 4,
          trackName: "Hub_SFX3",
          trackTitle: "sfx",
          keyBind: { key: "3", ctrl: true, shift: false, alt: false },
          trackNumber: 5,
        },
      ],
      defaultArray: [
        {
          trackId: 0,
          trackName: "VO",
          trackTitle: "vo",
          keyBind: { key: null, ctrl: false, shift: false, alt: false },
          trackNumber: 1,
        },
        {
          trackId: 1,
          trackName: "Hub_SFX",
          trackTitle: "sfx",
          keyBind: { key: "1", ctrl: true, shift: false, alt: false },
          trackNumber: 2,
        },
        {
          trackId: 2,
          trackName: "Hub_Music",
          trackTitle: "music",
          keyBind: { key: "Enter", ctrl: true, shift: false, alt: false },
          trackNumber: 3,
        },
        {
          trackId: 3,
          trackName: "Hub_SFX2",
          trackTitle: "sfx",
          keyBind: { key: "2", ctrl: true, shift: false, alt: false },
          trackNumber: 4,
        },
        {
          trackId: 4,
          trackName: "Hub_SFX3",
          trackTitle: "sfx",
          keyBind: { key: "3", ctrl: true, shift: false, alt: false },
          trackNumber: 5,
        },
      ],
    },
  },
};
async function getSettingsObject() {
  return await readFile(dir.editorHub.appData.settings)
    .then((settingsString) => {
      return JSON.parse(settingsString);
    })
    .catch((e) => hubException(e));
}
async function resolveSettings() {
  await readFile(dir.editorHub.appData.settings)
    .then((string) => JSON.parse(string))
    .catch(async () => {
      await writeFile(
        dir.editorHub.appData.settings,
        JSON.stringify(defaultSettings, null, 2)
      );
    })
    .catch((e) => global.hubException(e));
}
async function getSettingsGroup(settingsGroupName) {
  const content = await readFile(dir.editorHub.appData.settings);
  const settings = JSON.parse(content);
  if (!settings[settingsGroupName]) {
    settings[settingsGroupName] = defaultSettings[settingsGroupName];
  }
  return settings[settingsGroupName];
}
async function cacheSettings(target, newValue) {
  if (!global.settingsCache) {
    // alert('does not exist')
    global.settingsCache = {};
  }
  let settingsGroupName = target.closest("[data-settings-group").dataset
    .settingsGroup;

  const settingsGroup = await getSettingsGroup(settingsGroupName);
  if (!global.settingsCache[settingsGroupName]) {
    global.settingsCache[settingsGroupName] = settingsGroup;
  }

  let settingsObject;
  let settingsObjectName;
  let settingId = target.closest("[data-setting-id]").dataset.settingId;
  for (let prop in settingsGroup) {
    if (settingsGroup[prop]["id"] == settingId) {
      settingsObject = settingsGroup[prop]; // real settings
      settingsObjectName = prop;
      break;
    }
  }
  if (!global.settingsCache[settingsGroupName][settingsObjectName]) {
    global.settingsCache[settingsGroupName][settingsObjectName] =
      settingsObject;
  }
  if (settingsObject.type == "trackLayout") {
    let trackProperty = target.dataset.trackProperty;
    let trackId = target.closest("[data-track-id]").dataset.trackId;
    let currentArray =
      global.settingsCache[settingsGroupName][settingsObjectName][
        "currentArray"
      ]; // Cached settings
    for (let trackObject of currentArray) {
      if (trackObject.trackId != trackId) {
        continue;
      }
      if (trackProperty == "trackNumber") {
        // save oldValue
        let oldValue = trackObject[trackProperty];
        //assign new value to current track
        trackObject[trackProperty] += newValue;
        //find track to replace
        for (let t of currentArray) {
          if (t != trackObject && t.trackNumber == trackObject[trackProperty]) {
            t[trackProperty] = oldValue;
            break;
          }
        }
        break;
      } else {
        trackObject[trackProperty] = newValue;
        break;
      }
    }
  } else {
    global.settingsCache[settingsGroupName][settingsObjectName][
      "currentValue"
    ] = newValue;
  }

  let settingsDiv = target.closest(".settingsDiv");
  let settingsContainer = settingsDiv.parentElement;
  toggleActionButtons(settingsContainer, true);
}
async function clearCache(settingsContainer) {
  let settingsGroupName = settingsContainer.dataset.settingsGroup;
  let settingsGroup = await getSettingsGroup(settingsGroupName);
  let actions = settingsContainer.querySelector(".settingsActions");
  let settingsDiv = settingsContainer.querySelector(".settingsDiv");
  let panels = [...settingsDiv.children];
  for (let panel of panels) {
    let settingId = panel.children[1].dataset.settingId;
    let settingsObject = settingsGroup[settingId];
    let settingDiv = panel.children[1];
    if (panel.dataset.type == "slider") {
      let currentValue = settingsObject.currentValue;
      let slider = settingDiv.children[0];
      slider.value = currentValue;
    } else if (panel.dataset.type == "dropdown") {
      let currentValue = settingsObject.currentValue;
      let dropdownBody = settingDiv.querySelector(".dropdownBody");
      let options = dropdownBody.children;
      let currentOption = options[currentValue];
      currentOption.click();
    } else if (panel.dataset.type == "trackLayout") {
      let layoutList = settingDiv.querySelector(".layoutList");
      let trackObjects = settingsObject.currentArray;
      global.ui.renderSettingsTracks(layoutList, trackObjects);
    }
  }
  global.settingsCache = null;
  toggleActionButtons(settingsContainer, false);
}
async function consolidateSettings(container) {
  console.log();
  if (!global.settingsCache[container.dataset.settingsGroup]) {
    return;
  }
  return await getSettingsObject()
    .then(async (settings) => {
      let settingsGroupName = container.dataset.settingsGroup;
      settings[settingsGroupName] = global.settingsCache[settingsGroupName];
      stats.logSettingsChange(settings);
      return await writeFile(
        dir.editorHub.appData.settings,
        JSON.stringify(settings, null, 2)
      );
    })
    .then(() => clearCache(container));
}
async function restoreDefaultSettings(container, settingsGroup) {
  for (let prop in settingsGroup) {
    let setting = settingsGroup[prop];

    if (setting.type == "trackLayout") {
      setting.currentArray = setting.defaultArray;
    } else {
      setting.currentValue = setting.defaultValue;
    }
  }
  await readFile(dir.editorHub.appData.settings)
    .then((settingsString) => {
      let settings = JSON.parse(settingsString);
      settings[container.dataset.settingsGroup] = settingsGroup;
      return settings;
    })
    .then(async (settings) => {
      stats.logSettingsChange(settings);
      return await writeFile(
        dir.editorHub.appData.settings,
        JSON.stringify(settings, null, 2)
      );
    })
    .then(() => clearCache(container))
    .catch((e) => global.hubException(e));
}
async function clearDownloads(container) {
  let settingsGroupName = container.dataset.settingsGroup;
  let targetFolders = [];
  let importedFiles = await runJSXFunction(`getImportedPaths()`);
  importedFiles = JSON.parse(importedFiles);
  if (settingsGroupName == "audioTools") {
    targetFolders = [
      dir.editorHub.folder.resources.music,
      dir.editorHub.folder.resources.sfx,
    ];
  }
  for (let folder of targetFolders) {
    await iterateTreePath(folder, importedFiles);
  }
  cs.evalScript(
    `alert('Your downloads have been cleaned!\\nAny files imported into your current project were kept.','Editor hub')`
  );
}
async function iterateTreePath(folderPath, importedFiles) {
  let entries = await readdir(folderPath);
  for (let entry of entries) {
    let entryPath = `${folderPath}/${entry}`;
    let entryStats = await stat(entryPath);
    if (entryStats.isDirectory()) {
      await iterateTreePath(entryPath, importedFiles)
        .then(async () => await readdir(entryPath))
        .then(async (files) => {
          // alert(`${entry} : ${files.length}`)
          if (files.length == 0) {
            await rm(entryPath, { recursive: true, force: true });
          }
        })
        .catch((e) => hubException(e));
    } else if (entryStats.isFile()) {
      if (importedFiles) {
        let safe = false;
        for (let importedPath of importedFiles) {
          if (entryPath.toLowerCase() == importedPath.toLowerCase()) {
            safe = true;
            break;
          }
        }
        if (!safe) {
          await rm(entryPath);
        }
      }
    }
  }
}
function toggleActionButtons(container, activate) {
  let actions = container.querySelector(".settingsActions");

  let saveButton = actions.children[0];
  let cancelButton = actions.children[1];
  let restoreButton = actions.children[2];
  let clearDownloads = actions.children[3];

  let isSaveActive =
    getComputedStyle(saveButton).getPropertyValue("display") == "flex";
  let isCancelActive =
    getComputedStyle(cancelButton).getPropertyValue("display") == "flex";
  let isRestoreActive =
    getComputedStyle(restoreButton).getPropertyValue("display") == "flex";
  let isClearDownloadsActive =
    getComputedStyle(clearDownloads).getPropertyValue("display") == "flex";

  let settingsGroup = container.dataset.settingsGroup;

  if (
    activate &&
    !isSaveActive &&
    !isCancelActive &&
    isRestoreActive &&
    isClearDownloadsActive
  ) {
    saveButton.style.display = "flex";

    cancelButton.style.display = "flex";

    restoreButton.style.display = "none";

    clearDownloads.style.display = "none";
  } else if (
    !activate &&
    isSaveActive &&
    isCancelActive &&
    !isRestoreActive &&
    !isClearDownloadsActive
  ) {
    saveButton.removeAttribute("style");

    cancelButton.removeAttribute("style");

    restoreButton.removeAttribute("style");

    clearDownloads.removeAttribute("style");
  }
}
function getKeyBindText(keyBindObject) {
  if (!keyBindObject.key) {
    return null;
  }
  let keyTextNode = "";
  if (keyBindObject.ctrl) {
    keyTextNode += "Ctrl + ";
  }
  if (keyBindObject.shift) {
    keyTextNode += "Shift + ";
  }
  if (keyBindObject.alt) {
    keyTextNode += "Alt + ";
  }
  keyTextNode += keyBindObject.key;

  return keyTextNode;
}
function captureKeyBind(event, target) {
  if (
    event.key == "Control" ||
    event.key == "Shift" ||
    event.key == "Alt" ||
    event.key == "Meta"
  ) {
    return null;
  } else if (
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.metaKey &&
    (event.key == "Enter" ||
      event.key == "ArrowUp" ||
      event.key == "ArrowDown" ||
      event.key == "ArrowRight" ||
      event.key == "ArrowLeft")
  ) {
    return false;
  } else if (event.key == " ") {
    return false;
  }
  event.preventDefault();
  let keyBind = {};
  keyBind.key = event.key.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
  keyBind.ctrl = event.ctrlKey;
  keyBind.shift = event.shiftKey;
  keyBind.alt = event.altKey;

  let keyBindText = getKeyBindText(keyBind);
  cacheSettings(target, keyBind);

  return keyBindText;
  // document.removeEventListener('keydown', () => captureKeyBind())
}

module.exports = {
  defaultSettings,
  resolveSettings,
  getSettingsGroup,
  cacheSettings,
  clearCache,
  consolidateSettings,
  restoreDefaultSettings,
  getKeyBindText,
  captureKeyBind,
  getSettingsObject,
  clearDownloads,
};
