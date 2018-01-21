function getBoxTemplate(trendingList){
    var html = "<div style=\"padding:14px;color:hsla(0, 100%, 100%, .88);font-size:1.6rem;font-weight:700;line-height:2rem;max-height:2rem\">"
            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Tendencias" : "Trending")
    +"</div>";

    if(trendingList && trendingList.items && trendingList.items.length > 0){
        trendingList.items.forEach(function (item){
            var imgUrlComponents = item.snippet.thumbnails.medium.url.split('/');
            var imgUrl = '/getimg?videoId=' + imgUrlComponents[imgUrlComponents.length - 2] 
                    + '&fileName=' + imgUrlComponents[imgUrlComponents.length - 1];

            var fixedTitle = item.snippet.title.replace(/["']/g, "");
            html += "<div style=\"display:inline-block;padding:7px;width:250px;height:233px\">"
                + "<div style=\"text-align:center\">"
                    + "<img src=\"" + imgUrl + "\" onclick=\"handlePlay('" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "')\" style=\"cursor:pointer;max-width:232px\"/>"
                +"</div>"
                + "<div onclick=\"handlePlay('" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "')\" style=\"cursor:pointer;padding:7px;font-weight:500;line-height:1.6rem;font-size:1.4rem;color:hsla(0, 100%, 100%, .88);\">"
                    + item.snippet.title + "<br>"
                    + "<text style=\"color:hsl(0, 0%, 53.3%);line-height:1.8rem;font-size:1.3rem;font-weight:400\">"
                        + item.snippet.channelTitle
                        + "<br>" + getTimeText(item.snippet.publishedAt)
                    +"</text>"
                +"</div>"
            + "</div>";
        })
    }
    else{
        html = "<div style=\"text-align:center\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Sin resultados" : "No results") + "</div>"
    }

    return html;
}

function getListTemplate(searchResultsList){
    var html = '';

    if(searchResultsList && searchResultsList.items && searchResultsList.items.length > 0){
        html = "<table style=\"width:100%\">";
        searchResultsList.items.forEach(function (item){
            var fixedTitle = item.snippet.title.replace(/["']/g, "");
            var imgUrlComponents = item.snippet.thumbnails.medium.url.split('/');
            var imgUrl = '/getimg?videoId=' + imgUrlComponents[imgUrlComponents.length - 2] 
                    + '&fileName=' + imgUrlComponents[imgUrlComponents.length - 1];

            html += "<tr>"
                + "<td style=\"text-align:right\">"
                    + "<img src=\"" + imgUrl + "\" onclick=\"handlePlay('" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "')\" style=\"cursor:pointer;max-width:246px\"/>"
                +"</td>"
                + "<td>"
                    + "<div onclick=\"handlePlay('" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "')\" style=\"cursor:pointer;padding:7px;font-weight:500;line-height:1.6rem;font-size:1.4rem;color:hsla(0, 100%, 100%, .88);\">"
                        + item.snippet.title + "<br>"
                        + "<text style=\"color:hsl(0, 0%, 53.3%);line-height:1.8rem;font-size:1.3rem;font-weight:400\">"
                            + item.snippet.channelTitle + " &#8729; " + getTimeText(item.snippet.publishedAt)
                            + "<div style=\"margin-top:7px\">" + item.snippet.description + "</div>"
                        +"</text>"
                    +"</div>"
                +"</td>"
            +"</tr>";
        })

        html += "</table>";
    }
    else{
        html = "<div style=\"text-align:center\">Sin resultados</div>"
    }

    return html;
}

function getPlaylistsTemplate(playlists) {
    var html = '';
    
    if(playlists && playlists.length > 0){
    }
    else{
        html += "<div style=\"text-align:center;margin-top:25%;font-size:1.6rem\">"
        + "<i class=\"fa fa-coffee fa-2x\" style=\"color:hsl(0, 0%, 53.3%);\"></i><br>"
        + (deviceLanguage && deviceLanguage.indexOf('es')>=0? "Todav&iacute;a no creaste ninguna lista de reproducci&oacute;n": "No playlists created yet.") 
    + "</div>";
    }

    return html;
}

function getPlayVideoTemplate(videoId, videoTitle, channelTitle, publishedAt, imgUrl) {
    var html = '';
    
    if(videoId){
        html += "<div style=\"text-align:center;background:black;height:80%;margin-top:7px\">"
                + "<div id=\"loading-video-div\" style=\"height:100%;padding-top:20%\">"
                    + "<i class=\"fa fa-cog fa-spin fa-4x\"></i>"
                +"</div>"
                + "<video src=\"/stream?videoId=" + videoId + "\" style=\"height:100%;display:none\" poster=\"" + imgUrl + "\" autoplay controls></video>"
            +"</div>"
            + "<table style=\"width:100%;border-collapse:collapse\">"
                + "<tr>"
                    + "<td style=\"border-bottom:0.7px solid gray\">"
                        + "<div style=\"padding:7px;font-weight:500;line-height:1.6rem;font-size:1.4rem;color:hsla(0, 100%, 100%, .88);\">"
                            + videoTitle + "<br>"
                            + "<text style=\"color:hsl(0, 0%, 53.3%);line-height:1.8rem;font-size:1.3rem;font-weight:400\">"
                                + channelTitle + " &#8729; " + publishedAt
                            +"</text>"
                        +"</div>"
                    +"</td>"
                    + "<td style=\"width:340px;border-bottom:0.7px solid gray\">"
                        + "<a id=\"download-audio-btn-" + videoId + "\" class=\"video-action-btn\" onclick=\"getMedia('/get-mp3','mp3','" + videoId + "','" + videoTitle + "','" + channelTitle + "','" + publishedAt + "','" + imgUrl + "','download-audio-btn-" + videoId + "')\">"
                            + "<i class=\"fa fa-music fa-2x\" style=\"margin-right:7px\"></i>"
                            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR AUDIO" : "DOWNLOAD AUDIO")
                        + "</a> "
                        + "<a id=\"download-video-btn-" + videoId + "\" class=\"video-action-btn\" onclick=\"getMedia('/get-mp4','mp4','" + videoId + "','" + videoTitle + "','" + channelTitle + "','" + publishedAt + "','" + imgUrl + "','download-video-btn-" + videoId + "')\">"
                            + "<i class=\"fa fa-video-camera fa-2x\" style=\"margin-right:7px\"></i> "
                            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR V&Iacute;DEO" : "DOWNLOAD VIDEO")
                        + "</a>"
                    +"</td>"
                +"</tr>"
            +"</table>"
            
            +"<div id=\"similar-tracks\"></div>";
    }
    else{
        html += "<div style=\"text-align:center;margin-top:25%;font-size:1.6rem\">"
            + "<i class=\"fa fa-coffee fa-2x\" style=\"color:hsl(0, 0%, 53.3%);\"></i><br>"
            + (deviceLanguage && deviceLanguage.indexOf('es')>=0? "No hay nada por aqu&iacute;.<br>Selecciona un v&ideo para reproducirlo.": "Nothing around here.<br>Select a video to play it.") 
        + "</div>";
    }

    return html;
}

function getDownloadsPageInitialTemplate(){
    var html = '';
    
    html += "<div id=\"downloads-empty-msg\" style=\"text-align:center;margin-top:25%;font-size:1.6rem\">"
        + "<i class=\"fa fa-download fa-2x\" style=\"color:hsl(0, 0%, 53.3%);\"></i><br>"
        + (deviceLanguage && deviceLanguage.indexOf('es')>=0? "Aqu&iacute; se mostrar&acute;n las descargas.<br>Por el momento no hay ninguna.": "This is the download section.<br>In the mean time, is empty.") 
    + "</div>";
    return html;
}

function getDownloadItemTemplate(fileExtension, videoId, videoTitle, channelTitle, publishedAt, imgUrl) {
    var downloadsEmptyMsgDiv = document.getElementById('downloads-empty-msg');

    if(downloadsEmptyMsgDiv.style.display == ''){
        downloadsEmptyMsgDiv.style.display = 'none';
        document.getElementById('downloads-list').style.display = '';
    }

    var html = '';

    html += "<tr>"
        + "<td style=\"text-align:right\">"
            + "<img src=\"" + imgUrl + "\" style=\"max-width:246px\"/>"
        +"</td>"
        + "<td>"
            + "<div style=\"padding:7px;font-weight:500;line-height:1.6rem;font-size:1.4rem;color:hsla(0, 100%, 100%, .88);\">"
                + videoTitle + "<br>"
                + "<text style=\"color:hsl(0, 0%, 53.3%);line-height:1.8rem;font-size:1.3rem;font-weight:400\">"
                    + channelTitle + " &#8729; " + publishedAt
                    + "<div id=\"" + videoId + "-download-progress-" + fileExtension + "\" style=\"margin-top:7px\"></div>"
                +"</text>"
            +"</div>"
        +"</td>"
    +"</tr>";

    return html;
}