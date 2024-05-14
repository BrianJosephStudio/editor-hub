const { readFile } = require("fs/promises");
const path = require("path");
const dropbox = require(dir.editorHub.module.dropboxAPI);
const resourceAPI = require(dir.editorHub.module.resourceAPI);
const stats = require(dir.editorHub.module.stat);
const settings = require(dir.editorHub.module.settings);
const cs = new CSInterface();

const currentVideo = {};
const videoStorage = [];

function getCurrentVideo() {
  return currentVideo;
}
function initVideoPlayer() {
  let videoPlayer = document.getElementById("videoPlayer");
  videoPlayer.addEventListener("play", () => {
    let audioplayer = document.getElementById("audioPlayer");
    audioplayer.pause();
    currentVideo.playing = true;
  });
  videoPlayer.addEventListener("pause", () => {
    currentVideo.playing = false;
  });
}
async function previewVideo(event) {
  let isFirstTime;
  let target = event.currentTarget;
  const videoPlayer = document.getElementById("videoPlayer");
  if (videoPlayer.src) {
    isFirstTime = false;
  } else {
    isFirstTime = true;
  }

  let listItem;
  let dropboxPath;
  //Define listItem and DropboxPath
  if (event.type == "click") {
    listItem = target.closest(".listItem");
    dropboxPath = listItem.id;
  } else if (event.type == "keydown") {
    listItem = target;
    dropboxPath = listItem.id;
  } else if (event.type == "mousedown") {
    if (document.activeElement.id.slice(0, 18) == "/BrianJosephStudio") {
      listItem = document.activeElement;
    } else {
      if (!currentVideo.dropboxPath) {
        return null;
      }
      dropboxPath = currentVideo.dropboxPath;
    }
  }
  stats.logEvent(listItem, event, "preview", dropboxPath);
  //Highlight currently playing item
  if (listItem) {
    currentlyPlaying(listItem, dropboxPath);
  }
  // Search for arrayBuffer for selected item

  let found = false;
  for (const item of videoStorage) {
    if (item.dropboxPath == dropboxPath) {
      console.log("buffer found | videoGallery.js:64");
      found = true;
      break;
    }
  }
  if (!found) {
    await dropbox.AccessToken();
    console.log("downloading buffer for first time | videoGallery.js:70");
    const resource = new resourceAPI.Resource(dropboxPath);
    dropbox.download(resource.uri, dropboxPath, true).then((buffer) => {
      console.log("promise resolved | videoGallery.js:73");
      videoStorage.push({ dropboxPath: dropboxPath, fileBuffer: buffer });
    });
    if (videoStorage.length > 20) {
      videoStorage.splice(0, 1);
    }
  }

  //Behaviour Play/Pause if selected item is already on the player
  if (dropboxPath == currentVideo.dropboxPath) {
    if (currentVideo.playing) {
      videoPlayer.pause();
      // currentVideo.playing = false;
    } else {
      videoPlayer.play();
      // currentVideo.playing = true;
    }
    return;
  }
  if (listItem.dataset.tempLink) {
    let tempLink = JSON.parse(listItem.dataset.tempLink);
    let storedDate = new Date(tempLink.storedDate);
    let timeDiff = new Date() - storedDate;
    timeDiff = timeDiff / (1000 * 60 * 60);
    console.log(
      `Existing Temp Link was created ${
        Math.round(timeDiff * 100) / 100
      } hours ago | videoGallery.js:100`
    );
    if (timeDiff < 3.5) {
      videoPlayer.pause();
      videoPlayer.src = tempLink.link;
      if (isFirstTime) {
        const videoPlaceHolder = document.getElementById("videoPlaceHolder");
        videoPlaceHolder.style.display = "none";
        const videoSettings = await settings.getSettingsGroup("videoGallery");
        videoPlayer.volume = videoSettings.playerVolume.currentValue;
        console.log("video player volume has been set | videoGallery.js:108");
      }
      videoPlayer.play();
      console.log("Plays from existing temp link | videoGallery.js:111");
      currentVideo.dropboxPath = listItem.id;
      currentVideo.link = tempLink.link;
      currentVideo.playing = true;
      return;
    }
  }
  // for (let videoObject of videoStorage) {
  //   if (videoObject.dropboxPath == dropboxPath) {
  //     videoPlayer.pause();
  //     videoPlayer.src = videoObject.link;
  //     videoPlayer.play();
  //     return;
  //   }
  // }
  await dropbox.AccessToken();
  await dropbox
    .temporaryLink(dropboxPath)
    .then(async (link) => {
      console.log("created new link | videoGallery.js:128");
      let tempLink = {};
      tempLink.link = link;
      tempLink.storedDate = new Date().toISOString();
      listItem.dataset.tempLink = JSON.stringify(tempLink);
      videoPlayer.pause();
      videoPlayer.src = link;
      if (isFirstTime) {
        const videoPlaceHolder = document.getElementById("videoPlaceHolder");
        videoPlaceHolder.style.display = "none";
        const videoSettings = await settings.getSettingsGroup("videoGallery");
        const currentVolume = videoSettings.playerVolume.currentValue;
        videoPlayer.volume = currentVolume;
      }
      videoPlayer.play();
      currentVideo.dropboxPath = dropboxPath;
      currentVideo.link = link;
    })
    .catch((e) => hubException(e));
}
async function currentlyPlaying(listItem, dropboxPath) {
  let videoGalleryContainers = listItem.closest("#videoGalleryContainers");
  let listItems = [
    ...videoGalleryContainers.querySelectorAll('[data-searchable="item"]'),
  ];
  let playingFolders = [];
  for (let listItem of listItems) {
    // let isPlayingIcon = listItem.querySelector('.isPlaying')
    if (listItem.id == dropboxPath) {
      listItem.classList.add("listItemPlaying");
      // listItem.title = "Currently Playing";

      let parentFolderHead = listItem
        .closest(".listFolder")
        .querySelector(".listFolderHead");
      while (parentFolderHead.className == "listFolderHead") {
        playingFolders.push(parentFolderHead);
        let isPlaying = parentFolderHead.querySelector(".isPlayingFolder");
        isPlaying.style.opacity = "1";

        let listFolder =
          parentFolderHead.parentElement.parentElement.parentElement;
        if (listFolder.className != "listFolder") {
          break;
        }
        parentFolderHead = listFolder.querySelector(".listFolderHead");
      }
    } else {
      // listItem.removeAttribute("title");
      listItem.classList.remove("listItemPlaying");
      //   listItem.removeAttribute("style");
      let parentFolderHead = listItem
        .closest(".listFolder")
        .querySelector(".listFolderHead");
      while (parentFolderHead.className == "listFolderHead") {
        let abort;
        for (let playingFolder of playingFolders) {
          if (parentFolderHead == playingFolder) {
            abort = true;
          }
        }
        if (abort) {
          break;
        }
        let isPlaying = parentFolderHead.querySelector(".isPlayingFolder");
        isPlaying.removeAttribute("style");

        let listFolder =
          parentFolderHead.parentElement.parentElement.parentElement;
        if (listFolder.className != "listFolder") {
          break;
        }
        parentFolderHead = listFolder.querySelector(".listFolderHead");
      }
    }
  }
}
function adjustVolume(volume) {
  const videoPlayer = document.getElementById("videoPlayer");
  videoPlayer.volume = volume;
}
function getVideoStorage() {
  return videoStorage;
}
module.exports = {
  previewVideo,
  initVideoPlayer,
  getCurrentVideo,
  adjustVolume,
  getVideoStorage,
};
