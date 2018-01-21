var downloadingMedia = false;
var videoDownloadingId = '';
var videoDownloadingFileExt = '';
var pendingDownloads = [];

function buildFolderName() {
    var random = Math.random()*1000000000 + 1;

    var clientIP = random.toString().split('.')[0];
    
    return clientIP + '_' + Date.now();
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function getMedia(url, fileExtension, videoId, videoName, channelTitle, publishedAt, imgUrl, resultsDivId) {
    
    var fileType = '';
    switch(fileExtension)
    {
        case 'mp3': fileType = "audio"; break;
        case 'mp4': fileType = (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "v&iacute;deo" : "video"); break;
    }

    var loadingIcon = (fileExtension == 'mp3'? 'fa-music': 'fa-video-camera');
    
    if(downloadingMedia){
        var pendingDownloadItem = pendingDownloads.filter(function (item) { 
            return item.videoId == videoId && item.fileExtension == fileExtension 
        })[0];

        if(!pendingDownloadItem 
                && (videoId != videoDownloadingId
                    || (videoId == videoDownloadingId && fileExtension != videoDownloadingFileExt))){
            pendingDownloads.push({
                url: url,
                fileExtension: fileExtension,
                videoId: videoId,
                videoName: videoName,
                channelTitle: channelTitle,
                publishedAt: publishedAt,
                imgUrl: imgUrl,
                resultsDivId: resultsDivId
            });

            document.getElementById('downloads-list').innerHTML += getDownloadItemTemplate(fileExtension, videoId, videoName, channelTitle, publishedAt, imgUrl);
            document.getElementById(videoId + '-download-progress-' + fileExtension).innerHTML = (deviceLanguage && deviceLanguage.indexOf('es') >= 0? fileType + " en cola" : fileType + " queued");

            document.getElementById(resultsDivId).innerHTML = "<span class=\"fa " + loadingIcon + " fa-2x\"></span> "
            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "En cola" : "Queued");
        }

        return;
    }
    
    downloadingMedia = true;
    videoDownloadingId = videoId;
    videoDownloadingFileExt = fileExtension;

    var resultsDiv = document.getElementById(resultsDivId);
    var resulstsDivInnerHTML = '';
    var progressMessageHTML = '';
    switch(fileExtension)
    {
        case 'mp3': 
            resulstsDivInnerHTML = "<i class=\"fa fa-music fa-2x\" style=\"margin-right:7px\"></i>"
            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR AUDIO" : "DOWNLOAD AUDIO");

            progressMessageHTML = (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "Descargando audio" : "Downloading audio");            
            break;

        case 'mp4': 
            resulstsDivInnerHTML = "<i class=\"fa fa-video-camera fa-2x\" style=\"margin-right:7px\"></i> "
            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR V&Iacute;DEO" : "DOWNLOAD VIDEO");

            progressMessageHTML = (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "Descargando v&iacute;deo" : "Downloading video");            
            break;
    }

    var folderName = buildFolderName();
    var resultsDivOnDownloadPage = document.getElementById(videoId + '-download-progress-' + fileExtension);
    
    if(!resultsDivOnDownloadPage){
        document.getElementById('downloads-list').innerHTML += getDownloadItemTemplate(fileExtension, videoId, videoName, channelTitle, publishedAt, imgUrl);
        resultsDivOnDownloadPage = document.getElementById(videoId + '-download-progress-' + fileExtension);
    }
    
    if(resultsDiv)
        resultsDiv.innerHTML = "<span class=\"fa fa-cog fa-2x fa-spin\"></span> " 
                                + progressMessageHTML
                                + " <span id=\"" + videoId + "-progbtn-" + fileExtension + "\"></span>";

    resultsDivOnDownloadPage.innerHTML = "<span class=\"fa fa-cog fa-spin\" style=\"color:#009688\"></span> "
        + progressMessageHTML
        + " <span id=\"" + videoId + "-prog-" + fileExtension + "\"></span>";
    
    var socket = io('/');
    var socketId = "";
    
    socket.once('connect', function (){
        socketId = socket.io.engine.id;

        makeHTTPRequest(url + '?videoId=' + videoId + '&folderName=' + folderName + '&socketId=' + socketId, 'POST', function (response){
            socket.on('data', function (data) {
                var html = '';
                
                if(data.indexOf('[download]') >= 0){
                    var perc = data.split(' ')[2];
                    if(perc.indexOf('%')>=0){
                        html = data.split(' ')[2];
                    }
                }

                if(html){
                    var progBtn =document.getElementById(videoId + '-progbtn-' + fileExtension);
                    
                    if(progBtn)
                        progBtn.innerHTML = html;
                    
                    var prog = document.getElementById(videoId + '-prog-' + fileExtension);

                    if(prog)
                        prog.innerHTML = html;
                }
            });

            socket.on('finish', function (){
                resultsDivOnDownloadPage = document.getElementById(videoId + '-download-progress-' + fileExtension);
                if(resultsDivOnDownloadPage){
                    resultsDivOnDownloadPage.innerHTML = "<span class=\"fa fa-check-circle\" style=\"color:#009688\"></span> "
                    + fileType
                    + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? " descargado": " downloaded");
                }

                if(resultsDiv){
                    resultsDiv.innerHTML = "<span class=\"fa fa-check-circle fa-2x\" style=\"color:#009688\"></span> "
                    + fileType.toUpperCase()
                    + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? " DESCARGADO": " DOWNLOADED");

                    setTimeout(function () {
                        resultsDiv.innerHTML = resulstsDivInnerHTML;
                    }, 3000);
                }
                
                downloadURI('/get-media?folderName=' + folderName,videoName + '.' + fileExtension);

                downloadingMedia = false;
                videoDownloadingId = '';
                videoDownloadingFileExt = '';
    
                var nextDownloadItem = pendingDownloads.shift();
                
                if(nextDownloadItem)
                    getMedia(nextDownloadItem.url, nextDownloadItem.fileExtension, nextDownloadItem.videoId, nextDownloadItem.videoName, nextDownloadItem.channelTitle, nextDownloadItem.publishedAt, nextDownloadItem.imgUrl, nextDownloadItem.resultsDivId);

            })
        }, function (error){
            resultsDivOnDownloadPage = document.getElementById(videoId + '-download-progress-' + fileExtension);
            
            if(resultsDiv){
                resultsDiv.innerHTML = "<i class=\"fa fa-bug fa-2x\"></i>";
                
                setTimeout(function () {
                    resultsDiv.innerHTML = resulstsDivInnerHTML;
                }, 3000);    
            }
                
            if(resultsDivOnDownloadPage)
                resultsDivOnDownloadPage.innerHTML = "<span class=\"fa fa-bug\"></span> "
                + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Error al descargar el " + fileType: "Error downloading " + fileType);

            videoDownloadingId = '';
            videoDownloadingFileExt = '';
            downloadingMedia = false;
            var nextDownloadItem = pendingDownloads.shift();
            
            if(nextDownloadItem)
                getMedia(nextDownloadItem.url, nextDownloadItem.fileExtension, nextDownloadItem.videoId, nextDownloadItem.videoName, nextDownloadItem.channelTitle, nextDownloadItem.publishedAt, nextDownloadItem.imgUrl, nextDownloadItem.resultsDivId);
        })
    });
}