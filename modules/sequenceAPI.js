const { readFile, mkdir } = require('fs/promises');
const path = require('path')
const cs = new CSInterface();
const settings = require(global.dir.editorHub.module.settings)
cs.evalScript(`$.evalFile('${global.dir.editorHub.module.sequenceAPIjsx}')`)

// async function runJSXFunction(script){
//     return new Promise((resolve,reject) => {
//         cs.evalScript(script,resolve)
//     })
// }
async function findHubTrack(trackName,trackType){
    cs.evalScript(`findHubTrack('${trackName}','${trackType}')`)
}
function createHubTrack(trackName,trackType){
    cs.evalScript(`createHubTrack('${trackName}','${trackType}',1)`)
}
async function getHubTracks(){
    let hubTracks = await runJSXFunction(`getHubTracks()`)
    return hubTracks
}
async function resolveHubTrack(trackData){
    trackData = JSON.stringify(trackData)
    return await runJSXFunction(`resolveHubTrack(${trackData})`)
}
async function resolveVOTrack(trackName){
    return await runJSXFunction(`resolveVOTrack('${trackName}')`)
}
module.exports = {createHubTrack,findHubTrack,getHubTracks,resolveHubTrack,resolveVOTrack}