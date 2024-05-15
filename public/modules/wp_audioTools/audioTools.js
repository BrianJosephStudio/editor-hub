const dropbox = require(global.dir.editorHub.module.dropboxAPI);
const resourceAPI = require(global.dir.editorHub.module.resourceAPI);
// const settings = require(global.dir.editorHub.module.settings)
const { readFile } = require("fs/promises");
const path = require("path");
const stats = require(dir.editorHub.module.stat);

let audioContext;
let currentSourceNode;
let suspensionTimeout;
let animationFrameId;
let gainNode;
function getAudioContext() {
  return audioContext;
}
function getSourceNode() {
  if (currentSourceNode && currentSourceNode.dropboxPath) {
    return currentSourceNode;
  }
  return null;
}
async function renderAudioPlayer(body) {
  body.pause = () => {
    if (audioContext.playing) {
      playPause();
    }
  };
  if (!audioContext) {
    audioContext = new AudioContext();
    audioContext.playing = false;
    audioContext.bufferArray = [];
    audioContext.startTime = 0;
    audioContext.pausedTime = 0;

    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    suspensionTimeout = setTimeout(() => {
      audioContext.suspend();
    }, 30000);
  }

  const playIcon = document.createElement("div");
  playIcon.className = "playIcon";

  const playButton = document.createElement("div");
  playButton.className = "playButton";
  playButton.addEventListener("mousedown", (event) => {
    event.preventDefault();

    if (!currentSourceNode || !currentSourceNode.dropboxPath) {
      previewAudio(event);
    } else {
      playPause();
    }
  });
  playButton.appendChild(playIcon);

  const songName = document.createElement("h2");
  songName.id = "songName";
  // songName.appendChild(document.createTextNode('Play an audio file'))

  const timeDisplay = document.createElement("h2");
  timeDisplay.id = "timeDisplay";
  timeDisplay.appendChild(document.createTextNode("0:00 / 0:00"));

  const songData = document.createElement("div");
  songData.className = "songData";
  songData.appendChild(songName);
  songData.appendChild(timeDisplay);

  const progressBar = document.createElement("div");
  progressBar.className = "progressBar";

  const timeJumpBar = document.createElement("div");
  timeJumpBar.className = "timeJumpBar";

  const timeBar = document.createElement("div");
  timeBar.className = "timeBar";
  timeBar.addEventListener("mousedown", (event) => {
    let target = event.currentTarget;
    target.addEventListener("mousemove", scrub);
    target.removeEventListener("mousemove", hoverScrub);

    let timeJumpBar = document.querySelector(".timeJumpBar");
    timeJumpBar.removeAttribute("style");

    scrub(event);
  });
  timeBar.addEventListener("mouseover", (event) => {
    let target = event.currentTarget;
    target.addEventListener("mousemove", hoverScrub);
  });

  timeBar.addEventListener("mouseup", () =>
    timeBar.removeEventListener("mousemove", scrub)
  );
  timeBar.addEventListener("mouseleave", () => {
    timeBar.removeEventListener("mousemove", scrub);
    timeBar.removeEventListener("mousemove", hoverScrub);
    let timeJumpBar = document.querySelector(".timeJumpBar");
    timeJumpBar.removeAttribute("style");
  });

  timeBar.appendChild(progressBar);
  timeBar.appendChild(timeJumpBar);
  timeBar.appendChild(songData);

  const levelBar = document.createElement("div");
  levelBar.className = "levelBar";

  const volumeIcon = document.createElement("div");
  volumeIcon.className = "volumeIcon";

  const playerVolume = document.createElement("div");
  playerVolume.className = "playerVolume";
  playerVolume.appendChild(levelBar);
  playerVolume.appendChild(volumeIcon);
  playerVolume.addEventListener("mousedown", (event) => {
    adjustVolume(event);
    playerVolume.addEventListener("mousemove", adjustVolume);
  });
  playerVolume.addEventListener("mouseup", () =>
    playerVolume.removeEventListener("mousemove", adjustVolume)
  );
  playerVolume.addEventListener("mouseleave", () =>
    playerVolume.removeEventListener("mousemove", adjustVolume)
  );

  body.className = "audioPlayerBody";
  body.appendChild(playButton);
  body.appendChild(timeBar);
  body.appendChild(playerVolume);
}
function playPause(dropboxPath, audioBuffer, hardPlay, hardStop, reset) {
  if (hardPlay) {
    audioContext.playing = false;
  } else if (hardStop) {
    audioContext.playing = true;
  }
  if (audioContext.playing) {
    currentSourceNode.onended = null;
    // audioContext.playing = false
    currentSourceNode.stop();
    currentSourceNode.disconnect();
    stopProgressBar(false);
    playerIconToggle(false);
    suspensionTimeout = setTimeout(() => {
      audioContext.suspend();
    }, 30000);
  } else if (!audioContext.playing) {
    if (audioContext.state == "suspended") {
      audioContext.resume();
    }
    if (suspensionTimeout) {
      clearTimeout(suspensionTimeout);
      suspensionTimeout = null;
    }
    if (!audioBuffer && !dropboxPath) {
      audioBuffer = currentSourceNode.buffer;
      dropboxPath = currentSourceNode.dropboxPath;
    }

    currentSourceNode = audioContext.createBufferSource();
    currentSourceNode.buffer = audioBuffer;
    currentSourceNode.dropboxPath = dropboxPath;

    if (reset) {
      audioContext.pausedTime = 0;
    }
    //Stop video player!
    let videoPlayer = document.getElementById("videoPlayer");
    try {
      videoPlayer.pause();
    } catch (e) {}
    //
    currentSourceNode.connect(gainNode);
    currentSourceNode.start(0, audioContext.pausedTime);
    startProgressBar();
    playerIconToggle(true);
    audioContext.startTime = audioContext.currentTime;
    audioContext.playing = true;
    currentSourceNode.onended = audioEnded;
  }
}
async function previewAudio(event) {
  //Retrieve DropboxPath
  let target = event.currentTarget;
  let dropboxPath;
  let listItem;
  if (event.type == "click") {
    listItem = target.closest(".listItem");
    dropboxPath = listItem.id;
  } else if (event.type == "keydown") {
    listItem = target;
    dropboxPath = listItem.id;
  } else if (event.type == "mousedown") {
    if (document.activeElement.id.slice(0, 18) == "/BrianJosephStudio") {
      listItem = document.activeElement;
      dropboxPath = listItem.id;
    } else {
      if (!currentSourceNode.dropboxPath) {
        return null;
      }
      dropboxPath = currentSourceNode.dropboxPath;
    }
  }
  stats.logEvent(listItem, event, "preview", dropboxPath);
  if (listItem) {
    currentlyPlaying(listItem, dropboxPath);
  }
  //Deal with audioContext
  if (!audioContext) {
    audioContext = new AudioContext();
    audioContext.playing = false;
    audioContext.bufferArray = [];
    audioContext.startTime = 0;
    audioContext.pausedTime = 0;
  } else if (audioContext.state == "suspended") {
    audioContext.resume();
  }
  if (suspensionTimeout) {
    clearTimeout(suspensionTimeout);
    suspensionTimeout = null;
  }
  if (currentSourceNode) {
    // Play or pause current audio
    if (dropboxPath == currentSourceNode.dropboxPath) {
      playPause();
      return;
    }
    // Play new audio
    playPause(undefined, undefined, undefined, true);
    //Check if the audio buffer is already stored
    for (let bufferObject of audioContext.bufferArray) {
      if (bufferObject.dropboxPath == dropboxPath) {
        playPause(
          dropboxPath,
          bufferObject.audioBuffer,
          undefined,
          undefined,
          true
        );
        return;
      }
    }
  }
  //Look for audio file in resources folder
  let resource = new resourceAPI.Resource(dropboxPath);
  try {
    let audioFile = await readFile(resource.uri);
    let audioBuffer = await audioContext.decodeAudioData(audioFile.buffer);
    playPause(dropboxPath, audioBuffer, undefined, undefined, true);
    return;
  } catch (e) {
    null;
  }
  // Fetch song from Dropbox
  await dropbox.AccessToken();
  await dropbox
    .streamAudio(audioContext, dropboxPath)
    .then((bufferObject) => {
      if (bufferObject == null) {
        return null;
      }
      if (!gainNode) {
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
      }
      if (audioContext.playing) {
        return null;
      }
      audioContext.pausedTime = 0;
      playPause(dropboxPath, bufferObject.audioBuffer);
      audioContext.bufferArray.push(bufferObject);
    })
    .catch((e) => hubException(e));
}
function scrub(event) {
  document.getSelection().removeAllRanges();
  let target = event.currentTarget;
  target.parentElement.children[1].removeEventListener("mousemove", hoverScrub);
  let xPos = event.clientX - target.getBoundingClientRect().left;
  let progress = xPos / target.offsetWidth;
  jumpToTime(progress);
}
function hoverScrub(event) {
  if (!currentSourceNode) {
    return;
  }
  let target = event.currentTarget;
  let xPos = event.clientX - target.getBoundingClientRect().left;
  let progress = xPos / target.offsetWidth;
  let timeJumpBar = document.querySelector(".timeJumpBar");
  timeJumpBar.style.width = `${progress * 100}%`;
}
function adjustVolume(event) {
  let progress;
  if (typeof event === "number") {
    progress = event;
  } else {
    document.getSelection().removeAllRanges();
    let target = event.currentTarget;
    let yPos = event.clientY - target.getBoundingClientRect().top;
    progress = 1 - yPos / target.offsetHeight;
  }
  gainNode.gain.value = progress;
  let levelBar = document.querySelector(".levelBar");
  levelBar.style.height = `${progress * 100}%`;
}
function startProgressBar() {
  let progressBar = document.querySelector(".progressBar");
  let timeDisplay = document.querySelector("#timeDisplay");
  timeDisplay.textContent = getTimeDisplay();
  let startTime = audioContext.startTime;
  let pausedTime = audioContext.pausedTime;
  let progress =
    ((pausedTime + (audioContext.currentTime - startTime)) /
      currentSourceNode.buffer.duration) *
    100;
  // alert(`${progress}%`)
  progressBar.style.width = `${progress}%`;

  animationFrameId = requestAnimationFrame(startProgressBar);
}
function stopProgressBar(reset) {
  cancelAnimationFrame(animationFrameId);
  audioContext.playing = false;
  if (reset) {
    let progressBar = document.querySelector(".progressBar");
    progressBar.style.width = 0;
    audioContext.pausedTime = 0;
    return;
  } else {
    audioContext.pausedTime +=
      audioContext.currentTime - audioContext.startTime;
  }
}
function jumpToTime(progress) {
  let duration = currentSourceNode.buffer.duration;
  let time = Math.min(Math.max(duration * progress, 0), duration);
  audioContext.pausedTime = time;
  audioContext.startTime = audioContext.currentTime;
  let progressBar = document.querySelector(".progressBar");
  progressBar.style.width = `${progress * 100}%`;

  currentSourceNode.onended = null;
  currentSourceNode.stop();
  currentSourceNode.disconnect();
  // playerIconToggle(false)

  if (audioContext.playing) {
    let audioBuffer = currentSourceNode.buffer;
    let dropboxPath = currentSourceNode.dropboxPath;
    currentSourceNode = audioContext.createBufferSource();
    currentSourceNode.buffer = audioBuffer;
    currentSourceNode.dropboxPath = dropboxPath;
    currentSourceNode.connect(gainNode);
    currentSourceNode.start(0, audioContext.pausedTime);
    // playerIconToggle(true)
    currentSourceNode.onended = audioEnded;
  }
}
function audioEnded() {
  cancelAnimationFrame(animationFrameId);
  let progressBar = document.querySelector(".progressBar");
  progressBar.style.width = 0;
  audioContext.pausedTime = 0;
  audioContext.playing = false;
  playerIconToggle(false);
  suspensionTimeout = setTimeout(() => {
    audioContext.suspend();
  }, 30000);
  return;
}
function getTimeDisplay() {
  let currentTime =
    audioContext.pausedTime + audioContext.currentTime - audioContext.startTime;
  currentTime = formatTimestamp(currentTime);

  let fileLength = currentSourceNode.buffer.duration;
  fileLength = formatTimestamp(fileLength);
  return `${currentTime} / ${fileLength}`;
}
function formatTimestamp(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(1, "0");
  const formattedSeconds = String(secondsRemainder).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
function playerIconToggle(playing) {
  let playerButton = document.querySelector(".playButton");
  let playPause = playerButton.children[0];
  if (playing) {
    playPause.className = "pauseIcon";
    let songName = document.querySelector("#songName");
    songName.textContent = path
      .basename(currentSourceNode.dropboxPath)
      .split(".")[0];
  } else {
    playPause.className = "playIcon";
  }
}
async function currentlyPlaying(listItem, dropboxPath) {
  let audioToolContainers = listItem.closest("#audioToolContainers");
  let listItems = [
    ...audioToolContainers.querySelectorAll('[data-searchable="item"]'),
  ];
  let playingFolders = [];
  for (let listItem of listItems) {
    // let isPlayingIcon = listItem.querySelector('.isPlaying')
    if (listItem.id == dropboxPath) {
      listItem.classList.add("listItemPlaying");
      listItem.title = "Currently Playing";

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
      listItem.removeAttribute("title");
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
module.exports = {
  renderAudioPlayer,
  previewAudio,
  adjustVolume,
  getAudioContext,
  playPause,
  getSourceNode,
};
