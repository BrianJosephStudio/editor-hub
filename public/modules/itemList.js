const { match } = require("assert");
const { readFileSync } = require("fs");
const { readFile, writeFile } = require("fs/promises");
const videoGallery = require(dir.editorHub.module.videoGallery);
const audioTools = require(global.dir.editorHub.module.audioTools);
const dropbox = require(global.dir.editorHub.module.dropboxAPI);
const settings = require(global.dir.editorHub.module.settings);
const stat = require(global.dir.editorHub.module.stat);
const path = require("path");
const { pathToFileURL } = require("url");
const { dropboxPath } = require("./dropboxAPI");
const resourceAPI = require(global.dir.editorHub.module.resourceAPI);
const sequence = require(global.dir.editorHub.module.sequenceAPI);

const tagSystem = JSON.parse(readFileSync(dir.editorHub.jsonFiles.tagSystem));
const activeTags = [];
let showActiveTags = false;

const tagPaths = [];
let tagsReady = false;
let tagTimeOut;

/**
 * Creates an empty item list in the UI within the specified element and populates it.
 * @param {String} parentID The id of the list's parent element within which the list will be created.
 * @param {String} title The title displayed in the list's header.
 * @param {String} folderPath The dropbox folder path used as a reference to create the list
 * @param {Object} type An object containing data for the type of items in the list, it contains the svg icons as well as settings on how to preview the item.
 */
async function createList(parentID, folderPath, type, createTagSystem) {
  let container = document.getElementById(parentID);

  let listHeader = document.createElement("div");
  listHeader.setAttribute("class", "listHeader");

  let headerTitle = document.createElement("h2");
  headerTitle.setAttribute("style", "font-weight: 400;color:hsl(0, 0%, 85%)");
  let baseName = path.basename(folderPath).split(".")[0];
  let headerName = baseName.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
  let text = document.createTextNode(headerName);
  headerTitle.appendChild(text);
  listHeader.appendChild(headerTitle);

  let separator = document.createElement("div");
  separator.setAttribute("class", "listSeparator");

  let searchBar = document.createElement("input");
  searchBar.setAttribute("type", "text");
  searchBar.setAttribute("id", "searchBar");
  searchBar.setAttribute("name", "Search Bar");
  searchBar.setAttribute("class", "searchBar");
  searchBar.setAttribute("placeHolder", "Search...");
  let isAltPressed = false;
  searchBar.addEventListener("keydown", (event) => {
    if (showActiveTags || !createTagSystem) {
      return;
    }
    if (event.key === "Alt") {
      isAltPressed = true;
      console.log("Alt was pressed | itemList.js:58");
      showActiveTags = true;
      searchBar.dispatchEvent(new Event("input"));
    }
    // const tagSwitch = event.currentTarget.parentElement.querySelector(".tagSwitch")
    // tagSwitch.dispatchEvent(new Event("click"))
  });
  searchBar.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.key === "Alt" && createTagSystem) {
      isAltPressed = false;
      console.log("Alt was released | itemList.js:67");
      showActiveTags = false;
      searchBar.dispatchEvent(new Event("input"));
      searchBar.focus();
    }
  });
  document.addEventListener("keyup", (event) => {
    if (
      event.key === "Alt" &&
      isAltPressed &&
      showActiveTags &&
      document.activeElement !== searchBar
    ) {
      isAltPressed = false;
      console.log("blur | itemlist.js:75");
      showActiveTags = false;
      searchBar.dispatchEvent(new Event("input"));
      searchBar.focus();
    }
  });
  searchBar.addEventListener("input", (event) => {
    let value = event.target.value;

    if (createTagSystem) {
      const tagMatches =
        searchBar.parentElement.querySelector(".tagMatchesBox");
      (value[0] === "#" && value.slice(1)) || showActiveTags
        ? (tagMatches.style.display = "flex")
        : (tagMatches.style.display = "none");

      let searchOptions = searchBar.parentElement;
      let tagSwitch = searchOptions.querySelector(".tagSwitch");

      if (value[0] === "#" || isAltPressed) {
        tagSwitch.classList.add("tagSwitch_on");
        tagMatches.innerHTML = "";
        searchBar.style.color = "rgba(31, 96, 161, 1)";
        searchBar.style.fontWeight = "900";
        const matches = searchTag(value.slice(1));
        for (let tagObject of matches) {
          let displayName;
          if (tagObject.displayName !== "") {
            displayName = tagObject.displayName;
          } else {
            displayName = tagObject.tag;
          }
          let tagItem = document.createElement("li");
          tagItem.className = "tagItem";
          tagItem.title = tagObject.description;
          tagItem.dataset.tag = tagObject.tag;
          // tagItem.tabIndex = 1;
          let hashtag = document.createElement("h2");
          hashtag.style.color = "rgba(31, 96, 161, 1)";
          hashtag.appendChild(document.createTextNode("# "));
          hashtag.style.fontSize = "24px";
          hashtag.style.pointerEvents = "none";
          let tagTitle = document.createElement("h2");
          tagTitle.style.color = "white";
          tagTitle.style.pointerEvents = "none";
          tagTitle.appendChild(
            document.createTextNode(`\u00A0${displayName}\u00A0`)
          );
          let tagCode = document.createElement("h2");
          tagCode.style.color = "#2772CC";
          tagCode.fontSize = "8px";
          tagCode.style.pointerEvents = "none";
          tagCode.appendChild(document.createTextNode(tagObject.tag));

          let activeLabel;
          if (tagObject.active) {
            activeLabel = document.createElement("span");
            activeLabel.style.marginLeft = "8px";
            activeLabel.style.backgroundColor = "#2772CC";
            activeLabel.style.borderRadius = "50%";
            activeLabel.style.width = "8px";
            activeLabel.style.height = "8px";
            activeLabel.style.pointerEvents = "none";
          }

          tagItem.appendChild(hashtag);
          tagItem.appendChild(tagTitle);
          tagItem.appendChild(tagCode);
          if (tagObject.active) {
            tagItem.appendChild(activeLabel);
            const firstChild = tagMatches.children[0];
            if (firstChild) {
              tagMatches.insertBefore(tagItem, firstChild);
            } else {
              tagMatches.appendChild(tagItem);
            }
            continue;
          }
          if (showActiveTags) {
            if (
              matches.indexOf(tagObject) == matches.length - 1 &&
              !activeTags.length
            ) {
              tagItem.innerHTML = "";
              tagItem.removeAttribute("data-tag");
              tagItem.removeAttribute("title");
              tagTitle.textContent = "No active tags";
              tagItem.appendChild(tagTitle);
              tagMatches.appendChild(tagItem);
            }
            continue;
          }
          tagMatches.appendChild(tagItem);
        }
        if (!tagMatches.children.length) {
          const tagItem = document.createElement("li");
          tagItem.className = "tagItem";
          const tagTitle = document.createElement("h2");
          tagTitle.textContent = "No results";
          tagItem.appendChild(tagTitle);
          tagMatches.appendChild(tagItem);
        }
        if (value === "#.") {
          searchBar.value = "#";
        }
      } else {
        tagSwitch.classList.remove("tagSwitch_on");
        searchBar.removeAttribute("style");
      }
      if (value[0] === "#") {
        value = "";
      }
    }
    itemSearch(value, container.querySelector(".listDiv"));
  });
  let tagMatchesBox;
  let tagSwitch;
  if (createTagSystem) {
    tagMatchesBox = document.createElement("div");
    tagMatchesBox.className = "tagMatchesBox";
    tagMatchesBox.addEventListener("click", (event) => {
      console.log("tag was clicked");
      let target = event.target;
      if (target.tagName !== "LI" || !target.dataset.tag) {
        searchBar.dispatchEvent(new Event("input"));
        searchBar.focus();
        return;
      }
      // if (target.tagName === "H2") {
      //   target = target.parentElement;
      // }
      //

      const tag = target.dataset.tag;
      for (let prop in tagSystem) {
        const category = tagSystem[prop];
        category.forEach((item, index) => {
          if (item.tag === tag) {
            if (!item.active) {
              item.active = true;
              activeTags.push(tag);
              return;
            } else {
              item.active = false;
              let i = activeTags.indexOf(tag);
              activeTags.splice(i, 1);
            }
          }
        });
      }

      if (searchBar.value != "#.") {
        searchBar.value = "#";
        searchBar.dispatchEvent(new Event("input"));
      }
      searchBar.focus();
    });
    //
    tagSwitch = document.createElement("div");
    tagSwitch.className = "tagSwitch";
    tagSwitch.title = "Tags are Loading";
    let tagOpacity = 0.1;
    tagSwitch.addEventListener("click", (event) => {
      event.stopPropagation();
      let tmw = window.getComputedStyle(tagMatchesBox);
      if (
        tmw.getPropertyValue("display") === "flex" &&
        searchBar.value.length < 2
      ) {
        searchBar.value = "";
        searchBar.dispatchEvent(new Event("input"));
        tagSwitch.classList.remove("tagSwitch_on");
      } else {
        searchBar.value = "#.";
        searchBar.dispatchEvent(new Event("input"));
        searchBar.focus();
        searchBar.value = "#";
        tagSwitch.classList.add("tagSwitch_on");
      }
    });
    let intervalId = setInterval(() => {
      tagSwitch.style.opacity = tagOpacity;
      tagOpacity == 1 ? (tagOpacity = 0.1) : (tagOpacity = 1);
      if (tagsReady == true) {
        clearInterval(intervalId);
        tagSwitch.style.opacity = 1;
        tagSwitch.title = "Search by #tags";
        tagSwitch.style.transition = "0s";
      }
    }, 1500);
  }
  let searchOptions = document.createElement("div");
  searchOptions.style.display = "flex";
  searchOptions.style.alignItems = "center";
  searchOptions.style.backgroundColor = "hsl(0, 0%, 8%)";
  searchOptions.style.position = "relative";
  searchOptions.appendChild(searchBar);
  if (createTagSystem) {
    searchOptions.appendChild(tagMatchesBox);
    searchOptions.appendChild(tagSwitch);
  }

  let listDiv = document.createElement("div");
  // listDiv.setAttribute('id','listDiv')
  listDiv.setAttribute("class", "listDiv");
  container.appendChild(listHeader);
  container.appendChild(separator);
  container.appendChild(searchOptions);
  container.appendChild(listDiv);

  let noResults = document.createElement("li");
  noResults.id = "noResults";
  // noResults.className = "listItem";
  let noResultsH2 = document.createElement("h2");
  noResultsH2.className = "itemTitle";
  noResultsH2.appendChild(document.createTextNode("No results"));
  noResults.appendChild(noResultsH2);
  listDiv.appendChild(noResults);
  noResults.style.margin = "8px 0px 0px 8px";
  noResults.style.display = "none";

  await populateList(listDiv, folderPath, type, listDiv);
}
/**
 *
 * @param {HTMLElement} listBody The list's body, and HTML element into which the items will be created.
 * @param {String} folderPath The dropbox path to the folder from which the items will be fetched.
 * @param {Object} type An object containing data for the type of items in the list, it contains the svg icons as well as settings on how to preview the item.
 */
async function populateList(listBody, folderPath, type, listCanvas) {
  return await dropbox
    .getFiles(folderPath)
    .then(async (folderContent) => {
      folderContent.sort((a, b) => {
        if (
          listBody.closest(".innerContainer").id !== "ingameFootageContainer" ||
          a[".tag"] === "folder" ||
          b[".tag"] === "folder"
        ) {
          return 0;
        }

        let A = a.name.replace(/\.[^.]+$/, "").slice(-2);
        let B = b.name.replace(/\.[^.]+$/, "").slice(-2);

        if (isNaN(A)) {
          A = A[1];
        }
        if (isNaN(B)) {
          B = B[1];
        }
        if (isNaN(A) || isNaN(B)) {
          return 0;
        }
        return eval(A) - eval(B);
      });
      for (let item of folderContent) {
        if (item[".tag"] == "file") {
          let icon = document.createElement("div");
          icon.setAttribute("class", type.iconClass);

          let content = document.createTextNode(
            item.name.slice(0, item.name.lastIndexOf("."))
          );
          let itemTitle = document.createElement("div");
          itemTitle.className = "itemTitle";
          itemTitle.appendChild(content);

          let previewIcon = document.createElement("div");
          previewIcon.setAttribute("class", type.previewClass);

          let preview = document.createElement("div");
          preview.setAttribute("class", "itemPreview");
          preview.setAttribute("title", "preview");
          preview.addEventListener("click", (event) => type.preview(event));
          preview.appendChild(previewIcon);

          let importIcon = document.createElement("div");
          importIcon.setAttribute("class", "importIcon");

          let importButton = document.createElement("div");
          importButton.setAttribute("class", "itemImport");
          importButton.setAttribute("title", "Import/Place");
          importButton.appendChild(importIcon);
          importButton.addEventListener("click", (event) =>
            handleClick(
              event,
              dir.tutorial.editorHub.songManager,
              importFile,
              async (event) => {
                const target = event.currentTarget;
                let wp_container = target.closest(".wp_container");
                if (wp_container.dataset.workspace !== "audioTools") {
                  return importFile(event, target);
                }
                let settingsContainer = wp_container.querySelector(
                  "[data-settings-group]"
                );
                let settingsGroupName = settingsContainer.dataset.settingsGroup;
                let settingsGroup = await settings.getSettingsGroup(
                  settingsGroupName
                );
                let insertMode = settingsGroup.insertMode.currentValue;
                let trackLayout = settingsGroup.trackLayout.currentArray;
                trackLayout.sort((a, b) => {
                  return a.trackNumber - b.trackNumber;
                });
                let layoutArray = [];
                for (let trackObject of trackLayout) {
                  layoutArray.push(trackObject.trackName);
                  if (trackObject.trackTitle != type.trackTitle) {
                    continue;
                  }
                  await placeFile(event, target, layoutArray, insertMode);
                  break;
                }
              }
            )
          );

          let actionsBar = document.createElement("div");
          actionsBar.setAttribute("class", "actionsBar");
          actionsBar.appendChild(preview);
          actionsBar.appendChild(importButton);

          let today = new Date();
          let creationDate = new Date(item.server_modified);
          let timeDif = today - creationDate;
          let daysDif = timeDif / (1000 * 60 * 60 * 24);
          let isNew = daysDif <= 14;
          let newTag;
          if (isNew) {
            newTag = document.createElement("span");
            newTag.setAttribute("class", "newTag");
            newTag.appendChild(document.createTextNode("new"));
          }

          let isPlaying = document.createElement("div");
          isPlaying.className = "isPlaying";
          isPlaying.title = "Currently Playing";

          let elem = document.createElement("li");
          elem.setAttribute("id", item.path_lower);
          const tagPath = {
            elemId: item.path_lower,
            dropboxPath: item.path_display,
          };
          tagPaths.push(tagPath);

          const privateTagPaths = JSON.parse(JSON.stringify(tagPaths));

          if (tagPaths.length < 200) {
            clearTimeout(tagTimeOut);
          } else {
            tagPaths.length = 0;
          }
          tagTimeOut = setTimeout(async () => {
            downloadTags(privateTagPaths, listBody);
          }, 2000);
          elem.appendChild(icon);
          elem.appendChild(itemTitle);
          // elem.appendChild(isPlaying)
          if (isNew) {
            elem.appendChild(newTag);
          }
          elem.appendChild(actionsBar);
          elem.setAttribute("data-resource", JSON.stringify(item));
          elem.setAttribute("data-searchable", "item");
          elem.setAttribute("data-track-title", type.trackTitle);
          elem.setAttribute("data-track-type", type.trackType);
          elem.setAttribute("tabindex", "0");
          elem.setAttribute("class", "listItem");
          elem.addEventListener("keydown", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const target = event.currentTarget;
            if (event.code === "Space") {
              type.preview(event);
            } else if (event.code === "ArrowUp") {
              event.preventDefault();
              let activeElem = document.activeElement;
              let currentIndex = liItems.indexOf(activeElem);
              for (let i = currentIndex - 1; i >= 0; i--) {
                let previousLiElem = liItems[i];
                if (!listCanvas.contains(previousLiElem)) {
                  break;
                }
                let targetElem = previousLiElem;
                let skipElem = false;
                while (targetElem != listCanvas) {
                  let style = getComputedStyle(targetElem);
                  let display = style.getPropertyValue("display");
                  targetElem = targetElem.parentElement;
                  if (display == "none") {
                    skipElem = true;
                    break;
                  }
                }
                if (skipElem == true) {
                  continue;
                }
                previousLiElem.focus();
                break;
              }
            } else if (event.code === "ArrowDown") {
              event.preventDefault();
              let activeElem = document.activeElement;
              let currentIndex = liItems.indexOf(activeElem);
              for (let i = currentIndex + 1; i < liItems.length; i++) {
                let nextLiElem = liItems[i];
                if (!listCanvas.contains(nextLiElem)) {
                  break;
                }
                let targetElem = nextLiElem;
                let skipElem = false;
                while (targetElem != listCanvas) {
                  let style = getComputedStyle(targetElem);
                  let display = style.getPropertyValue("display");
                  targetElem = targetElem.parentElement;
                  if (display == "none") {
                    skipElem = true;
                    break;
                  }
                }
                if (skipElem == true) {
                  continue;
                }
                nextLiElem.focus();
                break;
              }
            } else if (
              event.code === "Enter" &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey
            ) {
              importFile(event, target);
            } else if (
              event.key == "Control" ||
              event.key == "Shift" ||
              event.key == "Alt" ||
              event.key == "Meta"
            ) {
              return null;
            } else {
              let wp_container = target.closest(".wp_container");
              let settingsContainer = wp_container.querySelector(
                "[data-settings-group]"
              );
              let settingsGroupName = settingsContainer.dataset.settingsGroup;
              let settingsGroup = await settings.getSettingsGroup(
                settingsGroupName
              );
              let insertMode = settingsGroup.insertMode.currentValue;
              let trackLayout = settingsGroup.trackLayout.currentArray;
              trackLayout.sort((a, b) => {
                return a.trackNumber - b.trackNumber;
              });
              let layoutArray = [];
              for (let trackObject of trackLayout) {
                layoutArray.push(trackObject.trackName);
                if (trackObject.trackTitle != type.trackTitle) {
                  continue;
                }
                let keyBind = trackObject.keyBind;
                if (
                  event.key.toLowerCase() == keyBind.key.toLowerCase() &&
                  event.ctrlKey == keyBind.ctrl &&
                  event.shiftKey == keyBind.shift &&
                  event.altKey == keyBind.alt
                ) {
                  console.log("esto no pasa");
                  await placeFile(event, target, layoutArray, insertMode);
                  break;
                }
              }
            }
          });
          // elem.addEventListener('keydown',event => {
          //     if(event.code === 'Tab'){alert('sisassss!')}
          // })
          listBody.appendChild(elem);
        } else if (item[".tag"] == "folder" && item.name !== "to Sort") {
          let folder = document.createElement("div");
          folder.setAttribute("class", "listFolder");
          folder.setAttribute("id", item.path_display);
          folder.setAttribute("data-resource", JSON.stringify(item));
          folder.setAttribute("data-searchable", "folder");

          let icon = document.createElement("div");
          icon.setAttribute("class", "folderIcon");

          let h2 = document.createElement("h2");
          let content = document.createTextNode(item.name);
          h2.setAttribute("style", "display:flex");
          h2.appendChild(content);

          let isPlaying = document.createElement("div");
          isPlaying.className = "isPlayingFolder";
          isPlaying.title = "Currently Playing";

          let header = document.createElement("div");
          header.setAttribute("class", "listFolderHead");
          header.addEventListener("click", (event) =>
            collapseFolderItem(event)
          );
          header.appendChild(icon);
          header.appendChild(h2);
          header.appendChild(isPlaying);
          // header.appendChild(actionsBar)

          let body = document.createElement("div");
          body.setAttribute("class", "listFolderBody");

          folder.appendChild(header);
          folder.appendChild(body);

          listBody.appendChild(folder);

          populateList(body, item.path_display, type, listCanvas);
        }
      }
      global.liItems = [...document.querySelectorAll("li")];
    })
    .catch((e) => global.hubException(e));
}
async function importFile(event, target, isPlace) {
  event.preventDefault();
  event.stopPropagation();
  //Stop all players
  let dropboxPath;
  if (event.type == "click") {
    dropboxPath = target.parentElement.parentElement.id;
  } else if ((event.type = "keydown")) {
    dropboxPath = target.id;
  }
  let resource = new resourceAPI.Resource(dropboxPath);

  let wp_container = target.closest(".wp_container");
  let settingsContainer = wp_container.querySelector("[data-settings-group]");
  let settingsGroupName = settingsContainer.dataset.settingsGroup;
  let settingsGroup = await settings.getSettingsGroup(settingsGroupName);
  if (!isPlace) {
    stat.logEvent(target, event, "fileImport", dropboxPath);
  }
  //make it so that the video player stops too
  if (audioTools.getAudioContext().playing) {
    audioTools.playPause();
  }
  let bufferArray;
  if (settingsGroupName == "videoGallery") {
    bufferArray = videoGallery.getVideoStorage();
  } else {
    bufferArray = audioTools.getAudioContext().bufferArray;
  }

  return await resourceAPI
    .importResource(resource, "dropbox", settingsGroup, bufferArray)
    .catch((e) => global.hubException(e));
}
async function placeFile(event, target, layoutArray, insertMode) {
  let trackTitle = target.closest("[data-track-title]").dataset.trackTitle;
  let trackType = target.closest("[data-track-type").dataset.trackType;
  let trackData = {
    trackType: trackType,
    trackTitle: trackTitle,
    layoutArray: layoutArray,
    insertMode: insertMode,
  };
  await sequence.resolveVOTrack(layoutArray[0]);
  await importFile(
    event,
    target,
    audioTools.getAudioContext().bufferArray,
    true
  )
    .then(async (resource) => {
      await resourceAPI.placeResource(resource, trackData);
      stat.logEvent(target, event, "filePlace", resource.dropboxPath);
    })
    .catch((e) => global.hubException(e));
}
/**
 *
 * @param {HTMLElement} parent
 * @param {String} id
 * @param {Array} options Array of option objects.
 * @param {Number} selected
 * @param {Function} callback
 */
async function createDropdown(id, options, selected) {
  let dropdownHead = document.createElement("div");
  dropdownHead.setAttribute("class", "dropdownHead");
  dropdownHead.setAttribute("id", id);
  let t = document.createElement("h2");
  t.appendChild(document.createTextNode(options[selected].value));
  dropdownHead.appendChild(t);
  // dropdownHead.setAttribute('data-current-value',JSON.stringify(options[selected]))

  let dropdownBody = document.createElement("div");
  dropdownBody.setAttribute("class", "dropdownBody");
  // dropdownBody.setAttribute('id','dropdownBody')
  for (let option of options) {
    let t = document.createElement("h2");
    t.appendChild(document.createTextNode(option.value));
    let o = document.createElement("div");
    o.setAttribute("class", "dropdownOption");
    o.setAttribute("data-value", JSON.stringify(option));
    o.appendChild(t);
    o.addEventListener("click", (event) => {
      event.stopPropagation();
      let optionValue = JSON.parse(event.currentTarget.dataset.value);
      let body = event.currentTarget.parentElement;
      body.removeAttribute("style");
      let head = body.parentElement.children[0];

      if (head.children[0].textContent == optionValue.value) {
        return;
      }
      head.children[0].textContent = optionValue.value;
      // head.dataset.currentValue = optionValue
      let newValue = options.indexOf(option);
      settings
        .cacheSettings(event.currentTarget, newValue)
        .then(() => {})
        .catch((e) => global.hubException(e));
    });
    dropdownBody.appendChild(o);
  }
  let dropdown = document.createElement("div");
  dropdown.setAttribute("class", "dropdown");
  dropdown.setAttribute("id", "dropdownContainer");
  dropdown.addEventListener("click", (event) => {
    event.stopPropagation();
    let panels = [...event.currentTarget.closest(".settingsDiv").children];
    for (let panel of panels) {
      if (panel == event.currentTarget.parentElement.parentElement) {
        continue;
      }
      let panelType = panel.dataset.type;
      if (panelType == "dropdown") {
        panel.children[1].children[0].children[1].removeAttribute("style");
      }
    }
    let body = event.currentTarget.children[1];
    let bodyDisplay = getComputedStyle(body).getPropertyValue("display");
    if (bodyDisplay == "none") {
      body.style.display = "flex";
    } else {
      body.removeAttribute("style");
    }
  });
  dropdown.appendChild(dropdownHead);
  dropdown.appendChild(dropdownBody);
  return dropdown;
}
function handleClick(event, tutorial, callback, ctrlCallback) {
  let target = event.currentTarget;
  if (event.ctrlKey && ctrlCallback) {
    ctrlCallback(event, target);
  } else {
    callback(event, target);
  }
}
function collapseFolderItem(event) {
  document.getSelection().removeAllRanges();
  let folder = event.currentTarget.parentElement.children[1];
  let style = window.getComputedStyle(folder);
  let folderDisplay = style.getPropertyValue("display");
  if (folderDisplay == "flex") {
    folder.style.display = "none";
  } else {
    folder.style.display = "flex";
    let listBody =
      event.currentTarget.parentElement.querySelector(".listFolderBody");
    resolveTempLinks(listBody);
  }
}
async function resolveTempLinks(listBody) {
  // dropbox.AccessToken();
  let items;
  if (Array.isArray(listBody)) {
    items = listBody;
  } else {
    items = [...listBody.children];
  }
  const queue = [];

  for (let item of items) {
    if (
      item.dataset.trackType === "audio" ||
      item.dataset.searchable !== "item"
    ) {
      continue;
    }
    try {
      let itemLink = JSON.parse(item.dataset.tempLink);
      let storedDate = new Date(itemLink.storedDate);

      let timeDifference = new Date() - new Date(storedDate);
      let hourDifference = timeDifference / (1000 * 60 * 60);

      if (hourDifference > 3.5) {
        throw new Error("hey");
      }
    } catch (e) {
      queue.push({ item: item, dropboxPath: item.id });
    }
  }

  for (let queueItem of queue) {
    try {
      const tempLink = {};
      await dropbox.temporaryLink(queueItem.dropboxPath).then((link) => {
        tempLink.link = String(link);
        tempLink.storedDate = new Date().toISOString();
        queueItem.item.dataset.tempLink = JSON.stringify(tempLink);
        setTimeout(() => {}, 1000);
      });
    } catch (e) {
      hubException(e);
    }
  }
}
function itemSearch(value, listDiv) {
  let listItems = [...listDiv.querySelectorAll("[data-searchable]")];
  let isMatch;
  const matchList = [];
  if (activeTags.length) {
    for (let item of listItems) {
      if (item.dataset.searchable === "item" && item.dataset.tags) {
        let tags = JSON.parse(item.dataset.tags);
        isMatch = activeTags.every((item) => tags.includes(item));
        if (isMatch) {
          matchList.push(item);
          item.style.display = "flex";
          item.title = `Tags: ${JSON.parse(item.dataset.tags).join(", ")}`;
          let parent = item.parentElement;
          while (parent != listDiv) {
            parent.style.display = "flex";
            parent.parentElement.style.display = "flex";
            parent = parent.parentElement.parentElement;
          }
        } else {
          item.style.display = "none";
          item.removeAttribute("title");
        }
      } else if (item.dataset.searchable === "folder") {
        item.style.display = "none";
        item.children[1].style.display = "none";
      }
    }
    resolveTempLinks(matchList);
    return;
  }
  //   let currentSourceNode = audioTools.getSourceNode()
  let noResults = true;
  listDiv.children[0].style.display = "none";
  for (let item of listItems) {
    if (value == "" && !activeTags.length) {
      noResults = false;
      if (item.dataset.searchable == "item") {
        item.removeAttribute("style");
      } else if (item.dataset.searchable == "folder") {
        item.children[1].removeAttribute("style");
        item.removeAttribute("style");
      }
      continue;
    }
    if (item.dataset.searchable == "item") {
      let res = JSON.parse(item.dataset.resource);
      if (res.name.toLowerCase().includes(value.toLowerCase())) {
        noResults = false;
        item.style.display = "flex";
        let parent = item.parentElement;
        while (parent != listDiv) {
          parent.style.display = "flex";
          parent.parentElement.style.display = "flex";
          parent = parent.parentElement.parentElement;
        }
      } else {
        item.style.display = "none";
      }
    } else if (item.dataset.searchable == "folder") {
      item.style.display = "none";
      item.children[1].style.display = "none";
    }
  }
  if (noResults) {
    listDiv.children[0].style.display = "flex";
  }
}
async function createSettingsList(parent, settingsGroup) {
  let container = document.getElementById(parent);

  let listHeader = document.createElement("div");
  listHeader.setAttribute("class", "listHeader");

  let headerTitle = document.createElement("h2");
  headerTitle.setAttribute("style", "font-weight: 400;color:hsl(0, 0%, 85%)");
  let text = document.createTextNode("Settings");
  headerTitle.appendChild(text);
  listHeader.appendChild(headerTitle);

  let separator = document.createElement("div");
  separator.setAttribute("class", "listSeparator");

  let listDiv = document.createElement("div");
  listDiv.setAttribute("class", "settingsDiv");
  listDiv.addEventListener("click", (event) => {
    let panels = [...event.currentTarget.children];
    for (let panel of panels) {
      let panelType = panel.dataset.type;
      if (panelType == "dropdown") {
        panel.children[1].children[0].children[1].removeAttribute("style");
      }
    }
  });

  for (let property in settingsGroup) {
    let setting = settingsGroup[property];
    let panel = createSettingsPanel(setting);
    listDiv.appendChild(panel);
  }

  let actions = document.createElement("div");
  actions.setAttribute("class", "settingsActions");

  let saveButton = document.createElement("div");
  saveButton.classList.add("actionButton", "saveButton");
  saveButton.appendChild(document.createTextNode("Save Changes"));
  saveButton.addEventListener("click", () =>
    settings.consolidateSettings(container)
  );

  let cancelButton = document.createElement("div");
  cancelButton.classList.add("actionButton", "cancelButton");
  cancelButton.appendChild(document.createTextNode("Cancel"));
  cancelButton.addEventListener("click", () => settings.clearCache(container));

  let restoreButton = document.createElement("div");
  restoreButton.classList.add("actionButton", "restoreButton");
  restoreButton.appendChild(document.createTextNode("Retore Default Settings"));
  restoreButton.addEventListener("click", () =>
    settings.restoreDefaultSettings(container, settingsGroup)
  );

  let clearDownloads = document.createElement("div");
  clearDownloads.classList.add("actionButton", "clearDownloadsButton");
  clearDownloads.appendChild(document.createTextNode("Clear Downloads"));
  clearDownloads.addEventListener("click", () =>
    settings.clearDownloads(container)
  );

  actions.appendChild(saveButton);
  actions.appendChild(cancelButton);
  actions.appendChild(restoreButton);
  actions.appendChild(clearDownloads);

  container.appendChild(listHeader);
  container.appendChild(separator);
  container.appendChild(listDiv);
  container.appendChild(actions);
}
function createSettingsPanel(settingsObject) {
  let panel = document.createElement("div");

  let settingTitle = document.createElement("h2");
  settingTitle.appendChild(document.createTextNode(settingsObject.name));

  let type = settingsObject.type;
  let setting = document.createElement("div");
  setting.setAttribute("data-setting-id", settingsObject.id);
  if (type == "slider") {
    let slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", settingsObject.valueRange[0]);
    slider.setAttribute("max", settingsObject.valueRange[1]);
    slider.setAttribute("step", settingsObject.valueRange[2]);
    slider.setAttribute("value", settingsObject.currentValue);
    slider.setAttribute("class", "slider");
    slider.addEventListener("input", async (event) => {
      let newValue = event.currentTarget.value;
      await settings.cacheSettings(event.currentTarget, eval(newValue));
    });
    setting.appendChild(slider);
    panel.setAttribute("data-type", "slider");
  } else if (type == "dropdown") {
    createDropdown(
      settingsObject.id,
      settingsObject.valueArray,
      settingsObject.currentValue
    ).then((dropdown) => {
      setting.appendChild(dropdown);
      panel.setAttribute("data-type", "dropdown");
    });
  } else if (type == "trackLayout") {
    let trackObjects = settingsObject.currentArray;
    let layoutList = document.createElement("div");
    layoutList.className = "layoutList";
    renderSettingsTracks(layoutList, trackObjects, undefined);
    setting.appendChild(layoutList);
    panel.setAttribute("data-type", "trackLayout");
  }

  panel.setAttribute("class", "settingsPanel");
  panel.appendChild(settingTitle);
  panel.appendChild(setting);

  return panel;
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
      keyBindDiv.children[0].textContent = settings.getKeyBindText(keyBind);
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
        settings.cacheSettings(event.currentTarget, event.currentTarget.value);
      });

      keyBindTitle = document.createElement("h2");
      keyBindTitle.style.marginRight = "auto";
      keyBindTitle.title = "keybind to place on this track";
      keyBindTitle.appendChild(document.createTextNode("keybind"));

      let kbText = settings.getKeyBindText(keyBind);
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
          let keyBindText = settings.captureKeyBind(event, target);
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
        await settings.cacheSettings(target.parentElement, -1);
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
        await settings.cacheSettings(target.parentElement, 1);
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
/**
 * Searches for tags in the tag system json and outputs an array of matches
 */
function searchTag(input) {
  const output = [];
  for (let prop in tagSystem) {
    const category = tagSystem[prop];
    for (let tag of category) {
      if (
        tag.tag
          .toLowerCase()
          .replace(/-/g, "")
          .includes(input.toLowerCase().replace(/-/g, "")) ||
        tag.displayName
          .toLowerCase()
          .replace(/-/g, "")
          .includes(input.toLowerCase().replace(/-/g, "")) ||
        showActiveTags ||
        input === "."
      ) {
        output.push(tag);
      }
    }
  }
  return output;
}
async function downloadTags(tagPaths, listBody) {
  let searchBar = listBody
    .closest(".innerContainer")
    .querySelector(".searchBar");
  const dropboxPaths = tagPaths.map((item) => item.dropboxPath);

  await dropbox
    .getTags(dropboxPaths)
    .then((pathsToTags) => {
      for (const tagPath of tagPaths) {
        const elem = document.getElementById(tagPath.elemId);
        const dropboxPath = tagPath.dropboxPath;

        const tagObject = pathsToTags.find(
          (tagObject) => tagObject.path === dropboxPath
        );

        if (tagObject && tagObject.tags.length) {
          // console.log(`found ${dropboxPath}`);
          let tags = [];
          for (let tag of tagObject.tags) {
            tags.push(tag.tag_text);
          }

          elem.dataset.tags = JSON.stringify(tags);
          elem.title = `Tags: ${tags.join(", ")}`;
          if (activeTags.length) {
            searchBar.dispatchEvent(new Event("input"));
          }
        } else {
          // console.log(`could not find ${dropboxPath}`);
        }
      }
      console.log("Finished Tag Batch | itemlist.js:1159");
      tagsReady = true;
    })
    .catch((e) => hubException(e));
}

module.exports = {
  handleClick,
  collapseFolderItem,
  placeFile,
  renderSettingsTracks,
  createList,
  createSettingsList,
  searchTag,
};
