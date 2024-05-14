const homedir = require("os").homedir().replace(/\\/g, "/");
const dropbox = require(dir.editorHub.module.dropboxAPI);
const { readFile, writeFile, readdir, rm } = require("fs/promises");
const path = require("path");

function formatDate(dateObject, includeHours) {
  let date = `${dateObject.getFullYear()}-${
    dateObject.getMonth() + 1
  }-${dateObject.getDate()}`;
  if (includeHours) {
    date += ` ${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;
  }
  return date;
}
async function logEvent(target, event, action, file) {
  console.log("logging event");
  const eventLog = {};
  eventLog.date = formatDate(new Date(), true);
  eventLog.workspace = target.closest(".wp_container").dataset.workspace;
  eventLog.tab =
    target.closest("[data-tab]").dataset.tab || target.dataset.tab || null;
  eventLog.action = action;
  eventLog.eventType = {
    type: event.type,
    key: event.code,
    ctrl: event.ctrlKey,
    shift: event.shiftKey,
    alt: event.altKey,
  };
  eventLog.file = file;

  let logFile = await resolveTodaysLog();
  if (!logFile) {
    throw new Error("Could not resolve current log");
  }
  await readFile(logFile)
    .then(async (logString) => {
      let logObject;
      try {
        logObject = JSON.parse(logString);
      } catch (e) {
        return logError(e);
      }
      logObject.logs.push(eventLog);
      return await writeFile(logFile, JSON.stringify(logObject, null, 2));
    })
    .catch((e) => hubException(e)); // don't include in final release
}
async function logError(stack) {
  const errorLog = {};
  errorLog.date = formatDate(new Date(), true);
  errorLog.stack = stack.replace(/\\n/g, "");

  let logFile = await resolveTodaysLog();
  if (!logFile) {
    throw new Error("Could not resolve current log");
  }
  await readFile(logFile)
    .then(async (logString) => {
      let logObject = JSON.parse(logString);
      logObject.errors.push(errorLog);
      return await writeFile(logFile, JSON.stringify(logObject));
    })
    .catch((e) => logError("Attempting to log an Error threw an Error")); // don't include in final release
}
async function logSettingsChange(settingsObject) {
  let logFile = await resolveTodaysLog();
  if (!logFile) {
    throw new Error("Could not resolve current log");
  }
  await readFile(logFile)
    .then(async (logString) => {
      let logObject = JSON.parse(logString);
      logObject.settings = settingsObject;
      return await writeFile(logFile, JSON.stringify(logObject));
    })
    .catch((e) => hubException(e)); // don't include in final release
}
async function getLogFiles() {
  return await readdir(dir.editorHub.folder.appData)
    .then((content) => {
      let logs = [];
      for (let file of content) {
        let fileName = file.slice(0, file.lastIndexOf("."));
        let decodedName = decodeString(fileName);
        let isLog = decodedName.split("_")[0];
        if (isLog == "activityLog") {
          logs.push(`${dir.editorHub.folder.appData}/${file}`);
        }
      }
      return logs;
    })
    .catch((e) => hubException(e));
}
async function resolveLogPosts() {
  return await getLogFiles().then(async (logs) => {
    for (let log of logs) {
      await readFile(log)
        .then((logString) => {
          try {
            return JSON.parse(logString);
          } catch (e) {
            return null;
          }
        })
        .then(async (logObject) => {
          if (!logObject) {
            return null;
          }
          let date = logObject.dateCreated.split(" ")[0];
          let keep = isDateToday(date);
          if (!keep) {
            logObject.user = decodeString(logObject.user);
            let content = JSON.stringify(logObject, null, 2);
            let fileName = decodeString(
              path.basename(log).slice(0, path.basename(log).lastIndexOf("."))
            );
            await dropbox
              .upload(
                content,
                `${dropbox.dropboxPath.editorHub.folder.stats}/${fileName}.json`
              )
              .then((res) => {
                if (res !== false) {
                  // rm(log);
                }
              });
          }
        })
        .catch((e) => hubException(e));
    }
  });
}
function isDateToday(formatedDate) {
  let today = formatDate(new Date(), false);
  let currentDate = new Date(today);
  let referenceDate = new Date(formatedDate);
  if (referenceDate < currentDate) {
    return false;
  } else {
    return true;
  }
}
async function resolveTodaysLog() {
  let date = new Date();
  let fileDate = formatDate(date, false);
  let logDate = formatDate(date, true);
  let logName = await generateLogName(fileDate);
  let encodedLogName = encodeString(logName);
  let logFile = `${dir.editorHub.folder.appData}/${encodedLogName}.json`;
  return await readFile(logFile)
    .then((content) => {
      if (JSON.parse(content)) {
        return logFile;
      }
    })
    .catch(async (e) => {
      if ((e.code = "ENOENT")) {
        let settingsString = await readFile(dir.editorHub.appData.settings);
        let settingsObject = JSON.parse(settingsString);
        let logBody = {
          user: encodeString(hubUser),
          dateCreated: logDate,
          settings: settingsObject,
          logs: [],
          errors: [],
        };
        await writeFile(logFile, JSON.stringify(logBody));
        return logFile;
      } else {
        await rm(logFile, { force: true, recursive: true });
        return await resolveTodaysLog();
      }
    })
    .catch((e) => hubException(e));
}
async function generateLogName(date) {
  let logName = `activityLog_${date}_${hubUser}`;
  return logName;
}
function encodeString(string) {
  return Buffer.from(string).toString("base64");
}
function decodeString(string) {
  return Buffer.from(string, "base64").toString();
}
module.exports = {
  resolveTodaysLog,
  resolveLogPosts,
  getLogFiles,
  encodeString,
  decodeString,
  isDateToday,
  formatDate,
  logEvent,
  logError,
  logSettingsChange,
};
