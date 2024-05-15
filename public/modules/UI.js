const { readFileSync } = require("fs");
// const { writeFile } = require('fs/promises');
// const { homedir } = require('os');
const videoGallery = require(dir.editorHub.module.videoGallery);
const audioTools = require(global.dir.editorHub.module.audioTools);
const dropbox = require(global.dir.editorHub.module.dropboxAPI);
const path = require("path");
const { eventNames } = require("process");
const settings = require(global.dir.editorHub.module.settings);
const stat = require(global.dir.editorHub.module.stat);
const itemList = require(dir.editorHub.module.itemList);

const listType = {
  sfx: {
    iconClass: "sfxIcon",
    previewClass: "audioPreviewIcon",
    preview: (event) => audioTools.previewAudio(event),
    trackTitle: "sfx",
    trackType: "audio",
    temporaryLink: false,
  },
  music: {
    iconClass: "musicIcon",
    previewClass: "audioPreviewIcon",
    preview: (event) => audioTools.previewAudio(event),
    trackTitle: "music",
    trackType: "audio",
    temporaryLink: false,
  },
  video: {
    iconClass: "videoIcon",
    previewClass: "videoPreviewIcon",
    preview: (event) => videoGallery.previewVideo(event),
    trackTitle: "video",
    trackType: "video",
    temporaryLink: true,
  },
};
async function buildUI() {
  //CONSTRUCT HTML HEAD
  //Create head elements
  let charset = document.createElement("meta");
  charset.setAttribute("charset", "utf-8");
  /* Import Fonts */
  let font = document.createElement("link");
  font.setAttribute("rel", "stylesheet");
  font.setAttribute(
    "href",
    "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,900;0,100;1,100;0,400;1,400;0,900&display=swap"
  );
  /* Import Base Global Styles */
  let base_style = document.createElement("link");
  base_style.setAttribute("id", "base_style");
  base_style.setAttribute("rel", "stylesheet");
  base_style.setAttribute("href", dir.editorHub.style.base_style);
  /* Import Workspace Layout Styles */
  let wp_style = document.createElement("link");
  wp_style.setAttribute("id", "wp_style");
  wp_style.setAttribute("rel", "stylesheet");
  wp_style.setAttribute("href", dir.editorHub.style.wp_style);
  /* Import UI Styles */
  let ui_style = document.createElement("link");
  ui_style.setAttribute("id", "ui_style");
  ui_style.setAttribute("rel", "stylesheet");
  ui_style.setAttribute("href", dir.editorHub.style.ui_style);
  /* Import Settings styles */
  let settings_style = document.createElement("link");
  settings_style.setAttribute("id", "settings_style");
  settings_style.setAttribute("rel", "stylesheet");
  settings_style.setAttribute("href", dir.editorHub.style.settings_style);
  /* Import Audio Tools Workspace Styles */
  let audioTools_style = document.createElement("link");
  audioTools_style.setAttribute("id", "audioTools_style");
  audioTools_style.setAttribute("rel", "stylesheet");
  audioTools_style.setAttribute("href", dir.editorHub.style.audioTools_style);
  /* Import Patch Notes Styles */
  let patchNotes_style = document.createElement("link");
  patchNotes_style.setAttribute("id", "patchNotes_style");
  patchNotes_style.setAttribute("rel", "stylesheet");
  patchNotes_style.setAttribute("href", dir.editorHub.style.patchNotes_style);
  /* Import videoGallery Styles */
  let videoGallery_style = document.createElement("link");
  videoGallery_style.setAttribute("id", "videoGallery_style");
  videoGallery_style.setAttribute("rel", "stylesheet");
  videoGallery_style.setAttribute(
    "href",
    dir.editorHub.style.videoGallery_style
  );
  //Append head elements to head
  let headElement = document.getElementsByTagName("head")[0];
  headElement.appendChild(charset);
  headElement.appendChild(font);
  headElement.appendChild(base_style);
  headElement.appendChild(wp_style);
  headElement.appendChild(ui_style);
  headElement.appendChild(settings_style);
  headElement.appendChild(audioTools_style);
  headElement.appendChild(patchNotes_style);
  headElement.appendChild(videoGallery_style);
  //CREATE HTML BODY
  let bodyContent = readFileSync(dir.editorHub.module.htmlBody, {
    encoding: "utf-8",
  });
  let body = document.getElementById("editorHub");
  body.innerHTML = bodyContent;
  console.addClear();

  // Update Access Token
  let audioPlayer = document.getElementById("audioPlayer");
  await audioTools.renderAudioPlayer(audioPlayer);
  await dropbox.AccessToken();

  // VIDEO GALLERY WORKSPACE
  videoGallery.initVideoPlayer();
  //Create In-game Footage List
  await itemList
    .createList(
      "ingameFootageContainer",
      `${dropbox.dropboxPath.editorHub.folder.resources.video}/ingameFootage`,
      listType.video,
      true
    )
    .catch((e) => global.hubException(e));

  // AUDIO TOOLS WORKSPACE
  //POPULATE SONG MANAGER
  await itemList
    .createList(
      "songManagerContainer",
      `${dropbox.dropboxPath.editorHub.folder.resources.music}`,
      listType.music,
      false
    )
    .catch((e) => global.hubException(e));
  //Populate SFX Lists
  await itemList
    .createList(
      "soundFxManagerContainer",
      `${dropbox.dropboxPath.editorHub.folder.resources.sfx}`,
      listType.sfx,
      false
    )
    .catch((e) => global.hubException(e));
  //Populate Settings
  const videoGallerySettings = await settings.getSettingsGroup("videoGallery");
  itemList.createSettingsList("videoSettingsContainer", videoGallerySettings);

  const audioToolsSettings = await settings.getSettingsGroup("audioTools");
  itemList.createSettingsList("audioSettingsContainer", audioToolsSettings);
  //Set Players Volume
  audioTools.adjustVolume(audioToolsSettings.playerVolume.currentValue);

  // Add spacebar listeners for players
  document.addEventListener("keydown", (event) => {
    if (
      event.code == "Space" &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      let videoPlayer = document.getElementById("videoPlayer");
      let audioPlayer = document.getElementById("audioPlayer");

      let videoPlayerContainer = document.getElementById("wp_videoGallery");
      let audioToolsContainer = document.getElementById("wp_audioTools");

      let currentVideo = videoGallery.getCurrentVideo();
      let audioContext = audioTools.getAudioContext();
      let currentSourceNode = audioTools.getSourceNode();

      let vpcDisplay = window
        .getComputedStyle(videoPlayerContainer)
        .getPropertyValue("display");
      let atcDisplay = window
        .getComputedStyle(audioToolsContainer)
        .getPropertyValue("display");

      if (vpcDisplay == "flex") {
        if (document.activeElement === videoPlayer) {
          console.log(`videoPlayer has focus | UI.js:183`);
          return;
        }
        if (currentVideo.dropboxPath) {
          if (videoPlayer.paused) {
            videoPlayer.play();
          } else {
            videoPlayer.pause();
          }
        } else if (audioContext.playing) {
          audioPlayer.pause();
        }
      } else if (atcDisplay == "flex") {
        if (currentSourceNode && currentSourceNode.dropboxPath) {
          let playButton = document.querySelector(".playButton");
          let clickEvent = new Event("mousedown");
          playButton.dispatchEvent(clickEvent);
        } else {
          videoPlayer.pause();
        }
      } else if (vpcDisplay == "none" && atcDisplay == "none") {
        if (!videoPlayer.paused) {
          videoPlayer.pause();
        }
        if (audioContext.playing) {
          audioPlayer.pause();
        }
      }
    }
  });

  //PATCH NOTES
  let dataLinks = [...document.querySelectorAll("[data-link]")];
  for (let link of dataLinks) {
    let linkTag = link.dataset.link;
    if (linkTag == "audioToolSettingsTab") {
      link.addEventListener("click", () => {
        const audioToolsTab = document.getElementById("wp_audioToolsTab");
        audioToolsTab.click();
        const audioSettingsTab = document.getElementById(
          "audioSettingsTab_inactive"
        );
        audioSettingsTab.click();
      });
    } else if (linkTag == "songManagerTab") {
      link.addEventListener("click", () => {
        const audioToolsTab = document.getElementById("wp_audioToolsTab");
        audioToolsTab.click();
        const audioToolsContainer = document.getElementById("wp_audioTools");
        const songManagerTab =
          audioToolsContainer.querySelectorAll(".innerTab")[0];
        songManagerTab.click();
      });
    } else if (linkTag === "sfxManagerTab") {
      link.addEventListener("click", () => {
        const audioToolsTab = document.getElementById("wp_audioToolsTab");
        audioToolsTab.click();
        const audioToolsContainer = document.getElementById("wp_audioTools");
        const sfxManagerTab =
          audioToolsContainer.querySelectorAll(".innerTab")[1];
        sfxManagerTab.click();
      });
    } else if (linkTag === "videoGalleryTab") {
      link.addEventListener("click", () => {
        const videoGallery = document.getElementById("wp_videoGalleryTab");
        videoGallery.click();
      });
    } else if (linkTag === "ingameFootageTab") {
      link.addEventListener("click", () => {
        const videoGalleryTab = document.getElementById("wp_videoGalleryTab");
        videoGalleryTab.click();

        const videoGalleryContainer =
          document.getElementById("wp_videoGallery");

        const ingameFootageTab =
          videoGalleryContainer.querySelectorAll(".innerTab")[0];
        ingameFootageTab.click();
      });
    } else if (linkTag === "tagSystem") {
      link.addEventListener("click", () => {
        const videoGalleryTab = document.getElementById("wp_videoGalleryTab");
        videoGalleryTab.click();

        const videoGalleryContainer =
          document.getElementById("wp_videoGallery");

        const ingameFootageTab =
          videoGalleryContainer.querySelectorAll(".innerTab")[0];
        ingameFootageTab.click();

        const ingameFootageContainer = document.getElementById(
          "ingameFootageContainer"
        );

        const tagSwitch = ingameFootageContainer.querySelector(".tagSwitch");
        tagSwitch.click();
      });
    }
  }
}
function change_wpTab(event) {
  //Reset all classes to inactive
  var wp_tabs = document.getElementsByClassName("wp_tab");
  for (var i = 0; i < wp_tabs.length; i++) {
    let tab = wp_tabs[i].getElementsByTagName("div")[1];
    tab.classList.remove(`${tab.classList[1]}_active`);

    wp_tabs[i]
      .getElementsByTagName("div")[0]
      .classList.remove("select_glow_active");
  }
  let targetElem = event.currentTarget.getElementsByTagName("div");
  targetElem[1].classList.add(`${targetElem[1].classList[1]}_active`);
  targetElem[0].classList.add("select_glow_active");

  //Make all containers invisible
  var wp_panels = document.getElementsByClassName("wp_container");
  for (var i = 0; i < wp_panels.length; i++) {
    wp_panels[i].style.display = "none";
    let settingsDiv = wp_panels[i].querySelector("[data-settings-group]");
    if (settingsDiv && global.settingsCache) {
      settings.clearCache(settingsDiv);
    }
  }
  //Set the active panel visible
  var buttonName = event.currentTarget.getElementsByTagName("div")[1].classList;
  for (var i = 0; i < wp_panels.length; i++) {
    var panelName = wp_panels[i].id;
    if (panelName.split("_")[1] == buttonName[1]) {
      wp_panels[i].style.display = "flex";
      break;
    }
  }
}
function changeInnerTab(event) {
  const target = event.currentTarget;
  const tabs = target.closest(".innerTabs").children;
  // const containers = document.getElementById("audioToolContainers").children
  for (var tab of tabs) {
    if (tab.id == event.currentTarget.id) {
      tab.classList.add("innerTab_active");
      tab.id = tab.id.replace(tab.id.split("_")[1], "active");
      let container = document.getElementById(
        tab.id.split("_")[0].replace("Tab", "Container")
      );
      container.style.display = "flex";
    } else {
      tab.classList.remove("innerTab_active");
      tab.id = tab.id.replace(tab.id.split("_")[1], "inactive");
      let container = document.getElementById(
        tab.id.split("_")[0].replace("Tab", "Container")
      );
      container.removeAttribute("style");
      if (
        container.hasAttribute("data-settings-group") &&
        global.settingsCache
      ) {
        settings.clearCache(container);
      }
    }
  }
}
async function openTutorial(target, event, embed) {
  await stat.logEvent(target, event, "Opened Tutorial", null);
  let tutorialViewer = document.getElementById("tutorialViewer");
  tutorialViewer.innerHTML = embed;
  tutorialViewer.style.display = "flex";
  setTimeout(() => {
    tutorialViewer.style.opacity = "1";
  }, 100);
  tutorialViewer.addEventListener("mouseover", (event) => {
    event.stopPropagation();
    event.preventDefault();
  });
  tutorialViewer.addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
    tutorialViewer.style.opacity = "0";
    setTimeout(() => {
      tutorialViewer.style.display = "none";
      tutorialViewer.innerHTML = "";
    }, 700);
    youtubePlayer = null;
  });
}
function handleClick(event, tutorial, callback, ctrlCallback) {
  let target = event.currentTarget;
  if (event.altKey && tutorial) {
    openTutorial(target, event, tutorial);
    // cep.util.openURLInDefaultBrowser(tutorial)
  } else if (event.ctrlKey && ctrlCallback) {
    ctrlCallback(event, target);
  } else {
    callback(event, target);
  }
}

module.exports = {
  buildUI,
  change_wpTab,
  changeInnerTab,
  openTutorial,
  handleClick,
};
