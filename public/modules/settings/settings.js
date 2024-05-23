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
      renderSettingsTracks(layoutList, trackObjects);
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

function renderSettingsTracks(layoutList, trackObjects, range) {
  //iterating through the tracks
  trackObjects.sort((a, b) => {
    return a.trackNumber - b.trackNumber;
  });
  let trackDivs = layoutList.children;
  let empty = false;
  if (trackDivs.length == 0) {
    empty = true;
  }
  for (let trackObject of trackObjects) {
    //checking the track is within range
    let i = trackObjects.indexOf(trackObject);
    if (range && (i < range[0] || i > range[1])) {
      continue;
    }
    //Defining the track div
    let trackDiv;
    if (empty) {
      trackDiv = document.createElement("div");
      trackDiv.setAttribute("class", "trackDiv");
    } else {
      trackDiv = trackDivs[i];
    }
    //Define props
    const { trackId, trackName, trackTitle, keyBind, trackNumber } =
      trackObject;
    let trackTitleH2, trackNameInput, keyBindTitle, keyBindDiv, actionsBox;
    trackDiv.dataset.trackId = trackId;
    let trackProps = trackDiv.querySelectorAll("[data-track-property]");
    if (trackProps.length == 4) {
      trackTitleH2 = trackDiv.querySelector(
        `[data-track-property="trackTitle"]`
      );
      trackTitleH2.textContent = trackTitle;
      trackNameInput = trackDiv.querySelector(
        `[data-track-property="trackName"]`
      );
      trackNameInput.value = trackName;
      keyBindTitle = trackDiv.children[2];
      keyBindDiv = trackDiv.querySelector(`[data-track-property="keyBind"]`);
      keyBindDiv.children[0].textContent = getKeyBindText(keyBind);
      actionsBox = trackDiv.querySelector(
        `[data-track-property="trackNumber"]`
      );
      actionsBox.dataset.trackNumber = trackNumber;
    } else {
      trackDiv.innerHTML = "";

      trackTitleH2 = document.createElement("h2");
      trackTitleH2.style.minWidth = "35px";
      trackTitleH2.title = "track type";
      trackTitleH2.dataset.trackProperty = "trackTitle";
      trackTitleH2.appendChild(document.createTextNode(trackTitle));

      trackNameInput = document.createElement("input");
      trackNameInput.type = "text";
      trackNameInput.value = trackName;
      trackNameInput.className = "inputBox";
      trackNameInput.title = "track's default name";
      trackNameInput.dataset.trackProperty = "trackName";
      trackNameInput.addEventListener("input", async (event) => {
        cacheSettings(event.currentTarget, event.currentTarget.value);
      });

      keyBindTitle = document.createElement("h2");
      keyBindTitle.style.marginRight = "auto";
      keyBindTitle.title = "keybind to place on this track";
      keyBindTitle.appendChild(document.createTextNode("keybind"));

      let kbText = getKeyBindText(keyBind);
      let keyBindH2 = document.createElement("h2");
      keyBindH2.appendChild(document.createTextNode(kbText));

      keyBindDiv = document.createElement("div");
      keyBindDiv.appendChild(keyBindH2);
      keyBindDiv.className = "trackKeyBind";
      keyBindDiv.title = "click to change";
      keyBindDiv.dataset.trackProperty = "keyBind";
      keyBindDiv.addEventListener("click", (event) => {
        event.stopPropagation();
        let target = event.currentTarget;
        let targetText = target.children[0];
        let currentKeybind = targetText.textContent;
        function captureKeyBind(event) {
          let keyBindText = captureKeyBind(event, target);
          if (keyBindText) {
            targetText.textContent = keyBindText;
          } else if (keyBindText == false) {
            targetText.textContent = currentKeybind;
          } else if (!keyBindText) {
            return null;
          }
          targetText.removeAttribute("style");
          document.removeEventListener("keydown", captureKeyBind);
        }
        document.addEventListener("keydown", captureKeyBind);
        targetText.textContent = "...";
        targetText.style.color = "hsl(45, 00%, 90%)";
      });
      let upArrow = document.createElement("div");
      upArrow.className = "upArrow";
      upArrow.title = "move track up";
      upArrow.addEventListener("click", async (event) => {
        let target = event.currentTarget;
        let trackDiv = target.closest(".trackDiv");
        let layoutList = trackDiv.parentElement;
        if ([...layoutList.children].indexOf(trackDiv) <= 1) {
          return;
        }
        let referenceElement;
        for (let i = 0; i < layoutList.children.length; i++) {
          let child = layoutList.children[i];
          if (child == target.closest(".trackDiv")) {
            referenceElement = layoutList.children[i - 1];
          }
        }
        await cacheSettings(target.parentElement, -1);
        layoutList.insertBefore(trackDiv, referenceElement);
      });
      let downArrow = document.createElement("div");
      downArrow.className = "downArrow";
      downArrow.title = "move track down";
      downArrow.addEventListener("click", async (event) => {
        let target = event.currentTarget;
        let trackDiv = target.closest(".trackDiv");
        let layoutList = trackDiv.parentElement;
        if (layoutList.lastChild === trackDiv) {
          return;
        }
        let referenceElement;
        for (let i = 0; i < layoutList.children.length; i++) {
          let child = layoutList.children[i];
          if (child == target.closest(".trackDiv")) {
            referenceElement = layoutList.children[i + 1];
            break;
          }
        }
        await cacheSettings(target.parentElement, 1);
        if (layoutList.lastChild === referenceElement) {
          layoutList.appendChild(trackDiv);
        } else {
          layoutList.insertBefore(referenceElement, trackDiv);
        }
      });

      actionsBox = document.createElement("div");
      actionsBox.className = "actionBox";
      actionsBox.dataset.trackProperty = "trackNumber";
      actionsBox.dataset.trackNumber = trackNumber;
      actionsBox.appendChild(upArrow);
      actionsBox.appendChild(downArrow);

      trackDiv.appendChild(trackTitleH2);
      trackDiv.appendChild(trackNameInput);
      trackDiv.appendChild(keyBindTitle);
      trackDiv.appendChild(keyBindDiv);
      trackDiv.appendChild(actionsBox);
    }
    if (!keyBind.key) {
      keyBindTitle.style.display = "none";
      keyBindDiv.style.display = "none";
      actionsBox.style.display = "none";
    } else {
      keyBindTitle.style.display = "flex";
      keyBindDiv.removeAttribute("style");
      actionsBox.removeAttribute("style");
    }
    if (empty) {
      layoutList.appendChild(trackDiv);
    }
  }
}

module.exports = {
  defaultSettings,
  resolveSettings,
  getSettingsGroup,
  cacheSettings,
  clearCache,
  consolidateSettings,
  renderSettingsTracks,
  restoreDefaultSettings,
  getKeyBindText,
  captureKeyBind,
  getSettingsObject,
  clearDownloads,
};
