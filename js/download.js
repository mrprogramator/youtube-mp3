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

function getMedia(url, fileExtension, videoId, videoName, channelTitle, publishedAt, imgUrl, resultsDivId, hideLabels, outputContainerId) {
    
    var fileType = '';
    var loadingIcon = '';

    switch(fileExtension)
    {
        case 'mp3': 
            fileType = "audio";
            loadingIcon = "fa-music";
            break;
        case 'mp4': 
            fileType = (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "v&iacute;deo" : "video");
            loadingIcon = "fa-video-camera";
            break;
        default : 
            fileType = (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "archivo" : "file");
            loadingIcon = "fa-cloud-download";
            break;
    }
    
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

            document.getElementById(resultsDivId).innerHTML = "<span class=\"fa fa-download fa-2x\"></span> "
            + (!hideLabels? 
                fileType + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? " en cola" : " queued")
                :
                "<span class=\"tooltiptext tooltiptext-bottom\">"
                    + fileType + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? " en cola" : " queued")
                +"</span>");
        }

        return;
    }
    
    downloadingMedia = true;
    videoDownloadingId = videoId;
    videoDownloadingFileExt = fileExtension;

    var resulstsDivInnerHTML = '';
    var progressMessageHTML = '';
    switch(fileExtension)
    {
        case 'mp3': 
            resulstsDivInnerHTML = "<i class=\"fa fa-music fa-2x\" style=\"margin-right:7px\"></i>"
            + (!hideLabels? (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR AUDIO" : "DOWNLOAD AUDIO"):"");

            progressMessageHTML = (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "Descargando audio" : "Downloading audio");            
            break;

        case 'mp4': 
            resulstsDivInnerHTML = "<i class=\"fa fa-video-camera fa-2x\" style=\"margin-right:7px\"></i> "
            + (!hideLabels? (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR V&Iacute;DEO" : "DOWNLOAD VIDEO"):"");

            progressMessageHTML = (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "Descargando v&iacute;deo" : "Downloading video");            
            break;
        
        default:
            resulstsDivInnerHTML = "<i class=\"fa fa-cloud-download\" style=\"margin-right:7px\"></i> "
            + (!hideLabels? (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR ARCHIVO" : "DOWNLOAD FILE"):"");

            progressMessageHTML = "";            
            break;
    }

    var folderName = buildFolderName();
    var resultsDivOnDownloadPage = document.getElementById(videoId + '-download-progress-' + fileExtension);
    
    if(!resultsDivOnDownloadPage){
        document.getElementById('downloads-list').innerHTML += getDownloadItemTemplate(fileExtension, videoId, videoName, channelTitle, publishedAt, imgUrl);
        resultsDivOnDownloadPage = document.getElementById(videoId + '-download-progress-' + fileExtension);
    }

    var outputConainer = null;
    
    if(outputContainerId){
        outputConainer = document.getElementById(outputContainerId);

        if(outputConainer)
            outputConainer.value = '';
    }

    var resultsDiv = document.getElementById(resultsDivId);
    if(resultsDiv && !outputConainer){
        resultsDiv.innerHTML = "<span class=\"fa fa-cog fa-2x fa-spin\"></span> " 
        + (!hideLabels? 
            progressMessageHTML + " <span id=\"" + videoId + "-progbtn-" + fileExtension + "\"></span>"
            : "<span class=\"tooltiptext tooltiptext-bottom\">" 
                + progressMessageHTML 
                + " <span id=\"" + videoId + "-progbtn-" + fileExtension + "\"></span>"
            + "</span>");
    }
    else{
        resultsDiv.innerHTML = "<span class=\"fa fa-cog fa-spin\"></span> " 
        + (!hideLabels? 
            progressMessageHTML + " <span id=\"" + videoId + "-progbtn-" + fileExtension + "\"></span>"
            : "<span class=\"tooltiptext tooltiptext-bottom\">" 
                + progressMessageHTML 
                + " <span id=\"" + videoId + "-progbtn-" + fileExtension + "\"></span>"
            + "</span>");
    }
        
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

                if(html && !outputConainer){
                    var progBtn =document.getElementById(videoId + '-progbtn-' + fileExtension);
                    
                    if(progBtn)
                        progBtn.innerHTML = html;
                    
                    var prog = document.getElementById(videoId + '-prog-' + fileExtension);

                    if(prog)
                        prog.innerHTML = html;
                }

                if(outputConainer){
                    outputConainer.value += data;
                    outputConainer.scrollTop = outputConainer.scrollHeight;
                }
            });

            socket.on('finish', function (){
                resultsDivOnDownloadPage = document.getElementById(videoId + '-download-progress-' + fileExtension);
                if(resultsDivOnDownloadPage && !outputConainer){
                    resultsDivOnDownloadPage.innerHTML = "<span class=\"fa fa-check-circle\" style=\"color:#009688\"></span> "
                    + fileType
                    + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? " descargado": " downloaded");
                }

                if(resultsDiv){
                    resultsDiv.innerHTML = "<span class=\"fa fa-check-circle fa-2x\" style=\"color:#009688\"></span> "
                    + (!hideLabels? 
                        fileType.toUpperCase() + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? " DESCARGADO": " DOWNLOADED")
                    : 
                        "<span class=\"tooltiptext tooltiptext-bottom\">" 
                            + fileType.toUpperCase() + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? " DESCARGADO": " DOWNLOADED") 
                        + "</span>");

                    setTimeout(function () {
                        if(fileExtension){
                            downloadURI('/get-media?folderName=' + folderName,videoName + '.' + fileExtension);
                        }
                        else{
                            downloadURI('/get-media?folderName=' + folderName, 'get-media');
                        }
                        resultsDiv.innerHTML = resulstsDivInnerHTML;
                    }, 3000);
                }

                downloadingMedia = false;
                videoDownloadingId = '';
                videoDownloadingFileExt = '';
    
                var nextDownloadItem = pendingDownloads.shift();
                
                if(nextDownloadItem)
                    getMedia(nextDownloadItem.url, nextDownloadItem.fileExtension, nextDownloadItem.videoId, nextDownloadItem.videoName, nextDownloadItem.channelTitle, nextDownloadItem.publishedAt, nextDownloadItem.imgUrl, nextDownloadItem.resultsDivId, hideLabels);

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
                getMedia(nextDownloadItem.url, nextDownloadItem.fileExtension, nextDownloadItem.videoId, nextDownloadItem.videoName, nextDownloadItem.channelTitle, nextDownloadItem.publishedAt, nextDownloadItem.imgUrl, nextDownloadItem.resultsDivId, hideLabels);
        })
    });
}