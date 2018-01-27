var nowPlayingListId = null;
var videoPlayingId = null;
var autoplay = true;
var nextSimilarVideo = null;

function addToNowPlaying(videoId, videoTitle, channelTitle, publishedAt, imgUrl){
    var nowPlayingListName = (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Reproduciendo": "Now Playing");

    if(nowPlayingListId == null){
        nowPlayingListId = addList(nowPlayingListName, false);
    }

    var nowPlayingList = getList(nowPlayingListId);
    
    nowPlayingList.items.push({
        id: videoId,
        videoTitle: videoTitle,
        channelTitle: channelTitle,
        publishedAt: publishedAt,
        imgUrl: imgUrl
    });
}

function toggleAutoplay(caller){
    autoplay = !autoplay;
    caller.innerHTML = "<i class=\"fa " + (autoplay? "fa-toggle-on" : "fa-toggle-off") + " fa-2x\" style=\"margin-right:7px;"+ (autoplay ? "color:#009688": "") +"\"></i>"
    + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "REP. AUTO" : "AUTOPLAY");
}

function getNextVideo(){
    var nextVideo = null;
    var nowPlayingList = getList(nowPlayingListId);
    
    if(nowPlayingList && nowPlayingList.items && nowPlayingList.items.length > 0){
        var videoPlaying = nowPlayingList.items.filter(function (item) { return item.id == videoPlayingId})[0];

        if(videoPlaying){
            var nextVideoIndex = nowPlayingList.items.indexOf(videoPlaying) + 1;

            if(nextVideoIndex < nowPlayingList.items.length){
                nextVideo = nowPlayingList.items[nextVideoIndex];
            }
        }
        else{
            nextVideo = nowPlayingList.items[0];
        }
    }

    return nextVideo;
}

function changeQuality(videoId, videoFormat, videoControlId){
    document.getElementById(videoControlId).src = "/stream?videoId=" + videoId + "&videoFormat=" + videoFormat;
}