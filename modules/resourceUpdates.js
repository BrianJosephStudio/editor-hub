const { readFile, writeFile, mkdir, rm } = require('fs/promises')
const audioTools = require(global.dir.editorHub.module.audioTools)
const dropbox = require(global.dir.editorHub.module.dropboxAPI)
const cs = new CSInterface();

async function getUpdateLogs(){
    return await mkdir(global.dir.editorHub.folder.appData,{recursive:true})
    .then(async () => {
        return await readFile(global.dir.editorHub.appData.updateLogs)
    })
    .then(async logs => {return JSON.parse(logs)})
    .catch(async e => {
        if(e.code == 'ENOENT'){
            try{
                await writeFile(global.dir.editorHub.appData.updateLogs,"[]",'utf-8')
                return await readFile(global.dir.editorHub.appData.updateLogs)
            }catch(e){throw(e)}
        }
        else{global.hubException(e)}
    })
}
async function getUpdateSheet(){
    return await fetch(`https://brianjosephstudio.github.io/Editor_Hub/jsonFiles/resourceUpdates.json`)
    .then( content => { return content.json()} )
    .catch( e => global.hubException(e))
}
async function getNewEntries(updateLogs,updateSheet){
    let output = []
    for( update of updateSheet ){
        let exists = false
        for ( log of updateLogs){
            if(update.id === log.id){
                exists = true
            }
        }
        if(exists === false){
            output.push(update)
        }
    }
    return output
}
async function addLog(updateLogs,newEntry,status){
    newEntry.status = status
    updateLogs.push(newEntry)
    await writeFile(global.dir.editorHub.appData.updateLogs,JSON.stringify(updateLogs))
    .then(() => {
        updateLogs = getUpdateLogs()
    })
    .catch(e => global.hubException(e))
}
async function updateResource(updateEntry){
    const uri = eval(updateEntry.uri);
    const newUri = eval(updateEntry.newUri)
    const dropboxPath = eval(updateEntry.dropboxPath)
    
    return await readFile(uri)
    .then(async () => await rm(uri))
    .then(async () => {
        await dropbox.download(newUri,dropboxPath)
    })
    .then(() => {return true})
    .catch( e => {
        if(e.code == 'ENOENT'){
            return false
        }
        global.hubException(e)
        return null
    })
}
async function updateResources(){
    let updateLogs = await getUpdateLogs().catch(e => global.hubException(e));
    let updateSheet = await getUpdateSheet().catch(e => global.hubException(e));
    let newEntries = await getNewEntries(updateLogs,updateSheet).catch(e => global.hubException(e));
    if(newEntries.length === 0){
        return
    }
    let status;
    try{
        for(let newEntry of newEntries){
            let updated = await updateResource(newEntry)
            if(updated == true){
                status = 'Updated'
            }
            else if (updated == false){
                status = 'Not Applied'
            }
            else{
                status = 'failed'
            }
            await addLog(updateLogs,newEntry,status)
        }
    }catch(e){global.hubException(e)}

}

module.exports = {updateResources}