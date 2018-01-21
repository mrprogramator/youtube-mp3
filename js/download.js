var downloadingMusic = false;
var downloadingVideo = false;

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

function getMedia(url, fileExtension, videoId, videoName, resultsDivId) {
    var downloadingMedia = false;
    
    switch(fileExtension)
    {
        case 'mp3': downloadingMedia = (downloadingMusic? true : false); break;
        case 'mp4': downloadingMedia = (downloadingVideo? true : false); break;
    }

    if(downloadingMedia)
        return;
    
    switch(fileExtension)
    {
        case 'mp3': downloadingMusic = true; break;
        case 'mp4': downloadingVideo = true; break;
    }

    var loadingIcon = (fileExtension == 'mp3'? 'fa-music': 'fa-video-camera');
    var resultsDiv = document.getElementById(resultsDivId);
    var resulstsDivInnerHTML = resultsDiv.innerHTML;
    var folderName = buildFolderName();

    resultsDiv.innerHTML = "<span class=\"fa " + loadingIcon + " fa-2x fa-spin\"></span> 0%";
    
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

                if(html)
                    resultsDiv.innerHTML = '<span class=\"fa ' + loadingIcon + ' fa-2x fa-spin\"></span> ' + html;
            });

            socket.on('finish', function (){
                resultsDiv.innerHTML = "<span class=\"fa fa-check-circle fa-2x\"></span>";
                downloadURI('/get-media?folderName=' + folderName,videoName + '.' + fileExtension);

                setTimeout(function () {
                    resultsDiv.innerHTML = resulstsDivInnerHTML;

                    switch(fileExtension)
                    {
                        case 'mp3': downloadingMusic = false; break;
                        case 'mp4': downloadingVideo = false; break;
                    }
                }, 3000);
            })
        }, function (error){
            resultsDiv.innerHTML = "<i class=\"fa fa-bug fa-2x\"></i>";
            setTimeout(function () {
                resultsDiv.innerHTML = resulstsDivInnerHTML;
                
                switch(fileExtension)
                {
                    case 'mp3': downloadingMusic = false; break;
                    case 'mp4': downloadingVideo = false; break;
                }
            }, 3000);
        })
    });
}