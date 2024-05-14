app.enableQE()
function resolveVOTrack(trackName){
    var qeSequence = qe.project.getActiveSequence(0)
    var voTrack = qeSequence.getAudioTrackAt(0)
    if(voTrack.name == trackName){return}
    voTrack.setName(trackName)
}
function createHubTrack(trackName,trackType,position){
    /*
        addTrack(
        arg1 - number of video tracks to add,
        arg2 - position to add video tracks (zero-based index),
        arg3 - number of audio tracks to add,
        arg4 - audio track type (see legend below),
        arg5 - position to add audio tracks (zero-based index),
        arg6 - number of submixes to add,
        arg7 - submix type (see legend below),
        arg8 - position to add submix (zero-based index))

        And then the audio track / submix types are as follows:
        0: Mono
        1: Standard
        2: 5.1
        3: Stereo
     */    
    var newTrack
    if(trackType == 'video'){
        var qeSequence = qe.project.getActiveSequence(0)
        qeSequence.addTracks(1,position,0,0)
        qeSequence = qe.project.getActiveSequence(0)
        var videoTrack = qeSequence.getVideoTrackAt(position)
        videoTrack.setName(trackName)
        newTrack = app.project.activeSequence.videoTracks[position]
    }else if (trackType == 'audio'){
        var qeSequence = qe.project.getActiveSequence(0)
        qeSequence.addTracks(0,0,1,1,position,0,3,0)
        qeSequence = qe.project.getActiveSequence(0)
        var audioTrack = qeSequence.getAudioTrackAt(position)
        audioTrack.setName(trackName)        
        newTrack = app.project.activeSequence.audioTracks[position]
    }
    return {track: newTrack, index: position}
}
function findHubTrack(trackName,trackType){
    var sequence = app.project.activeSequence
    if(trackType == 'video'){
        var tracks = sequence.videoTracks
        for(var i = 0; i < tracks.length; i++){
            var track = tracks[i]
            if(track.name == trackName){
                return {track: track, index: i}
            }
        }
        return null
    }else if (trackType == 'audio'){
        var tracks = sequence.audioTracks
        for(var i = 0; i < tracks.length; i++){
            var track = tracks[i]
            if(track.name == trackName){
                return {track: track, index: i}
            }
        }
        return null
    }
}
function getHubTracks(){
    var seq = app.project.activeSequence
    var vTracks = seq.videoTracks
    var aTracks = seq.audioTracks
    var hubTracks = {videoTracks:[],audioTracks:[]};
    
    for(var i = 0; i < vTracks.length;i ++){
        var vTrack = vTracks[i]
        if(vTrack.name.split('_')[0] == 'Hub'){
            hubTracks.videoTracks.push(vTrack)
        }
    }
    for(var i = 0; i < aTracks.length;i ++){
        var aTrack = aTracks[i]
        if(aTrack.name.split('_')[0] == 'Hub'){
            hubTracks.audioTracks.push(aTrack)
        }
    }
    return hubTracks
}
function resolveHubTrack(trackData){
    trackData = JSON.parse(trackData)
    var trackName = trackData.layoutArray[trackData.layoutArray.length -1]
    var trackType = trackData.trackType
    var targetTrack = findHubTrack(trackName,trackType)
    if(targetTrack){return targetTrack.index}
    for(var i = trackData.layoutArray.length - 2; i >= 0; i--){
        var track = trackData.layoutArray[i]
        var refTrack = findHubTrack(track,trackType)
        if(!refTrack){continue}
        var targetTrack = createHubTrack(trackName,trackType,refTrack.index+1)
        return targetTrack.index
    }
}