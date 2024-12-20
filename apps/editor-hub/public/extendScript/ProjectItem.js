function setInPoint(referenceId, time, mediaType){
    var projectItem = CSInterfaceX.projectItems[referenceId]
    if(!projectItem) throw new Error("ProjectItem not found");

    var response = projectItem.setInPoint(time, mediaType)
    return response
}

function setOutPoint(referenceId, time, mediaType){
    var projectItem = CSInterfaceX.projectItems[referenceId]
    if(!projectItem) throw new Error("ProjectItem not found");
    
    var response = projectItem.setOutPoint(time, mediaType)
    return response
}

function getMediaPath(referenceId) {
    var projectItem = CSInterfaceX.projectItems[referenceId]
    if(!projectItem) throw new Error("ProjectItem not found");

    var mediaPath = projectItem.getMediaPath()
    return mediaPath
}