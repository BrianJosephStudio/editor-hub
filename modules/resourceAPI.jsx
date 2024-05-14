//This sets the xmp metadata for the resource after import at system file level(best way to do it)
function setDescription(FileObject,description){
    var format = 'FILE_'+FileObject.displayName.split('.')[1].toUpperCase()
    try{
        var xmpFile = new XMPFile(FileObject.fsName,format,XMPConst.OPEN_FOR_UPDATE)
        var xmpMeta = new XMPMeta();
        xmpMeta.setProperty( XMPConst.NS_XMP,"Resource",description)
        xmpFile.putXMP(xmpMeta)
        xmpFile.closeFile()
    }catch(e){alert(e)}
}

function getDescription(item){
    var itemXMP = item.getXMPMetadata();
    var xmp = new XMPMeta(itemXMP);
    return xmp.getProperty(XMPConst.NS_XMP,"Resource")
}
//This sets the xmp project description of the resource folder.
function setBinDescription(item,description){
    var itemMetadata = item.getProjectMetadata();
    var xmp = new XMPMeta(itemMetadata);
    xmp.setProperty(kPProPrivateProjectMetadataURI,"Column.PropertyText.Comment",description);
    item.setProjectMetadata(xmp.serialize(),["Column.PropertyText.Comment"]);
}
//This returns the resource/bin xmp metadata to identify the resource
function getBinDescription(item){
    var itemMetadata = item.getProjectMetadata();
    var xmp = new XMPMeta(itemMetadata);
    return xmp.getProperty(kPProPrivateProjectMetadataURI,"Column.PropertyText.Comment")
}
function importResource(uri,targetBin,targetBinDescription,description){
    var searchBin = resolveBin(app.project.rootItem,targetBin,targetBinDescription);
    var exists = findResource('description',searchBin,description,1)
    if (exists != undefined){return exists.select()}
    app.project.importFiles([uri],false,searchBin,false)
    var newItem = findResource('description',searchBin,description,1)
    newItem.select()
    return description
}
/**
 * Returns an aray of project items of a certain type within a given folder.
 * @param {projectItem} searchFolder The target folder to search, normally 'rootItem'.
 * @param {{Array}} inputArray An empty array that will be returned with the list of projectItems in your searchFolder.
 * @param {number | string} type The enumerated type of items to filter by, one of 1,2,3,4 or 'all'.
 * @returns An array of projectItems
 */
function searchProject(searchFolder,inputArray,type){
    /**
     * TYPE GLOSARY:
     * 1 - CLIP
     * 2 - BIN
     * 3 - ROOT
     * 4 - FILE
     */
    var items = searchFolder.children;
    for(var i = 0; i < items.length; i++)
    {
        var item = items[i];
        if (item.type == 1 && (type == 1 || type == 'all'))
        {
            inputArray.push(item)
        }
        else if(item.type == 2)
        {
            if(type == 2 || type == 'all'){inputArray.push(item)};
            inputArray = searchProject(item,inputArray,type)
        }
        else if(item.type == 4 && (type == 4 || type == 'all'))
        {
            inputArray.push(item)
        }
    }
    return inputArray
}
function getImportedPaths(){
    var projectItems = searchProject(app.project.rootItem,[],1)
    var output = []
    for (var i = 0; i < projectItems.length; i++){
        var item = projectItems[i]
        var itemPath = item.getMediaPath()
        if(itemPath){
            output.push(itemPath.replace(/\\/g,'/'))
        }
    }
    return JSON.stringify(output)
}
/**
 * Retrieves all items from the given type and searches your target item from that.
 * @param {String} searchType The type of search to perform.
 * @param {projectItem} searchFolder The bin to search in.
 * @param {*} searchValue The value to search by, depends on searchType.
 * @param {Number | String} type The type of item you're searching
 * @returns {projectItem} A projectItem, undefined if not found.
 */
function findResource(searchType,searchFolder,searchValue,type){
    var items = searchProject(searchFolder,[],type)
    switch(searchType){
        case "description":
            switch(type){
                case 1:
                    for(var i = 0; i < items.length; i++){
                        var desc = String(getDescription(items[i]));
                        // alert(String(desc))
                        // alert(String(searchValue))
                        // alert(String(desc == searchValue))
                        if(desc == searchValue)
                        {
                            return items[i]
                        }
                    }
                    break;
                case 2:
                    for(var i = 0; i < items.length; i++){
                        var desc = String(getBinDescription(items[i]));
                        if(desc == searchValue)
                        {
                            return items[i]
                        }
                    }
                    break;
                default:
                    return undefined
            }
            break;
        case 'filePath':
            switch(type){
                case 1:
                    for(var i = 0; i < items.length; i++){
                        var item = items[i]
                        var itemPath = item.getMediaPath()
                        if (itemPath == searchValue){
                            return itemPath
                        }
                    }
                    break;
                default:
                    return null
            }
        default:
            return undefined
    };
}
/**
 * Searches a bin inside the provided binParent. Creates a new one if not found.
 * @param {projecctItem} binParent The bin inside which the search will be performed.
 * @param {String} binName The name the function will create the bin with if it doesn't find it.
 * @param {String} binDescription The bin description value that will be used to search the bin.
 * @returns {projectItem} A bin projectItem.
 */
function resolveBin(binParent,binName,binDescription){
    var binSearch = findResource('description',binParent,binDescription,2);
    if(binSearch != undefined)
    {
        return binSearch
    };
    var newBin = binParent.createBin(binName);
    setBinDescription(newBin,binDescription)
    return newBin;
}
function placeResource(targetBin,targetBinDescription,description,trackData){
    trackData = JSON.parse(trackData)
    var searchBin = resolveBin(app.project.rootItem,targetBin,targetBinDescription);
    var projectItem = findResource('description',searchBin,description,1)
    projectItem.clearOutPoint()
    var activeSequence = app.project.activeSequence
    if(!activeSequence){return}
    var trackName = trackData.layoutArray[trackData.layoutArray.length-1]
    var trackType = trackData.trackType
    var track = findHubTrack(trackName,trackType)
    if(!track){
        return false
    }
    track = track.track
    var allowedLength
    if(trackData.insertMode == 0 && track.clips.length > 0){
        allowedLength = getAllowedLength(track)
        if(allowedLength == false){
            return false
        }else if(allowedLength && allowedLength < projectItem.getOutPoint().ticks){
            projectItem.setOutPoint(allowedLength/254016000000,4)
        }
    }
    var time = activeSequence.getPlayerPosition()
    track.overwriteClip(projectItem,time)
    projectItem.clearOutPoint()
    if(trackData.trackTitle == 'sfx'){
    var trackItem
    for(var i = 0; i < track.clips.length; i++){
        var clip = track.clips[i]
        if (clip.start.ticks == time.ticks){
            trackItem = clip
        }
    }
        activeSequence.setPlayerPosition(trackItem.end.ticks)
    }
}
function getProjectPath(){
    var projectPath = app.project.path
    return projectPath
}
function getAllowedLength(track){
    var actSeq = app.project.activeSequence
    var time = actSeq.getPlayerPosition().ticks
    var clips = track.clips
    if(clips.length == 0){return null}
    for(var i = 0; i < clips.length; i++){
        var clip = clips[i]
        var start = clip.start.ticks
        var end = clip.end.ticks
        if(Math.ceil(start) < Math.ceil(time) && Math.ceil(end) > Math.ceil(time)){
            return false
        }else if (Math.ceil(end) < Math.ceil(time)){
            continue
        }else if(Math.ceil(start) > Math.ceil(time)){
            return start - time
        }
    }

}