function getBoxTemplate(trendingList, title){
    var html = "<div style=\"padding:14px;color:hsla(0, 100%, 100%, .88);font-size:1.6rem;font-weight:700;line-height:2rem;max-height:2rem\">"
            + title
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
                + "<div style=\"text-align:center;padding:7px\">"
                    + "<a id=\"add-nowplaying-btnbox-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"handleAddNowPlaying('" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "','add-nowplaying-btnbox-" + item.id.videoId + "', true)\">"
                        + "<i class=\"fa fa-youtube-play fa-2x\"></i>"
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "AGREGAR A LA COLA" : "ADD TO NOW PLAYING") + "</span>"
                    + "</a> "
                    + "<a id=\"download-audio-btnbox-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"getMedia('/get-mp3','mp3','" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "','download-audio-btnbox-" + item.id.videoId + "', true)\">"
                        + "<i class=\"fa fa-music fa-2x\"></i>"
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR AUDIO" : "DOWNLOAD AUDIO") + "</span>"
                    + "</a> "
                    + "<a id=\"download-video-btnbox-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"getMedia('/get-mp4','mp4','" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "','download-video-btnbox-" + item.id.videoId + "', true)\">"
                        + "<i class=\"fa fa-video-camera fa-2x\"></i> "
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR V&Iacute;DEO" : "DOWNLOAD VIDEO") + "</span>"
                    + "</a>"
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

function getListTemplate(searchResultsList, title){
    var html = "<div style=\"padding:14px;color:hsla(0, 100%, 100%, .88);font-size:1.6rem;font-weight:700;line-height:2rem;max-height:2rem\">"
        + (title? title:"")
    +"</div>";
    if(searchResultsList && searchResultsList.items && searchResultsList.items.length > 0){
        html += "<table style=\"width:100%\">";
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
                            + "<div style=\"margin-top:7px\">" + item.snippet.description.substring(0,200) + "</div>"
                        +"</text>"
                    +"</div>"
                +"</td>"
                + "<td style=\"width:140px\">"
                    + "<a id=\"add-nowplaying-btnlist-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"handleAddNowPlaying('" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "','add-nowplaying-btnlist-" + item.id.videoId + "', true)\">"
                        + "<i class=\"fa fa-youtube-play fa-2x\"></i>"
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "AGREGAR A LA COLA" : "ADD TO NOW PLAYING") + "</span>"
                    + "</a> "
                    + "<a id=\"download-audio-btnlist-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"getMedia('/get-mp3','mp3','" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "','download-audio-btnlist-" + item.id.videoId + "', true)\">"
                        + "<i class=\"fa fa-music fa-2x\"></i>"
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR AUDIO" : "DOWNLOAD AUDIO") + "</span>"
                    + "</a> "
                    + "<a id=\"download-video-btnlist-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"getMedia('/get-mp4','mp4','" + item.id.videoId + "','" + fixedTitle + "','" + item.snippet.channelTitle + "','" + getTimeText(item.snippet.publishedAt) + "','" + imgUrl + "','download-video-btnlist-" + item.id.videoId + "', true)\">"
                        + "<i class=\"fa fa-video-camera fa-2x\"></i> "
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR V&Iacute;DEO" : "DOWNLOAD VIDEO") + "</span>"
                    + "</a>"
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

function getPlayVideoTemplate(videoId, videoTitle, channelTitle, publishedAt, imgUrl, videoFormat) {
    var html = '';
    
    if(videoId){
        html += "<div style=\"text-align:center;background:black;height:80%;margin-top:7px\">"
                + "<div id=\"loading-video-div\" style=\"height:100%;padding-top:20%\">"
                    + "<i class=\"fa fa-cog fa-spin fa-4x\"></i>"
                +"</div>"
                + "<video id=\"video-control-" + videoId + "\" src=\"/stream?videoId=" + videoId + "&videoFormat=" + videoFormat + "\" style=\"width:100%;height:100%;display:none\" poster=\"" + imgUrl + "\" autoplay controls></video>"
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
                    + "<td style=\"text-align:right;border-bottom:0.7px solid gray\">"
                        + "<a id=\"toggle-autoplay-btn-" + videoId + "\" class=\"video-action-btn\" onclick=\"toggleAutoplay(this)\">"
                            + "<i class=\"fa " + (autoplay? "fa-toggle-on" : "fa-toggle-off") + " fa-2x\" style=\"margin-right:7px;"+ (autoplay ? "color:#009688": "") +"\"></i>"
                            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "REP. AUTO" : "AUTOPLAY")
                        + "</a> "
                        + "<a id=\"download-audio-btn-" + videoId + "\" class=\"video-action-btn\" onclick=\"getMedia('/get-mp3','mp3','" + videoId + "','" + videoTitle + "','" + channelTitle + "','" + publishedAt + "','" + imgUrl + "','download-audio-btn-" + videoId + "')\">"
                            + "<i class=\"fa fa-music fa-2x\" style=\"margin-right:7px\"></i>"
                            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR AUDIO" : "DOWNLOAD AUDIO")
                        + "</a> "
                        + "<a id=\"download-video-btn-" + videoId + "\" class=\"video-action-btn\" onclick=\"getMedia('/get-mp4','mp4','" + videoId + "','" + videoTitle + "','" + channelTitle + "','" + publishedAt + "','" + imgUrl + "','download-video-btn-" + videoId + "')\">"
                            + "<i class=\"fa fa-video-camera fa-2x\" style=\"margin-right:7px\"></i> "
                            + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "DESCARGAR V&Iacute;DEO" : "DOWNLOAD VIDEO")
                        + "</a>"
                        + "<a id=\"select-quality-btn-" + videoId + "\" class=\"video-action-btn\" style=\"display:none\" onclick=\"toggleConfigMenu('select-quality-icon-" + videoId + "','select-quality-menu-" + videoId + "')\">"
                            + "<i id=\"select-quality-icon-" + videoId + "\" class=\"fa fa-cog fa-2x\" style=\"margin:7px\"></i>"
                            + "<div id=\"select-quality-menu-" + videoId + "\" style=\"position:absolute;right:14px;top:48%;background:rgba(17, 17, 17, 0.75);min-width:137px;height:279px;overflow-y:scroll;index:1;display:none\">"
                            +"</div>"
                        + "</a> "
                    +"</td>"
                +"</tr>"
            +"</table>"
            +"<div id=\"nowplaying-tracks\" style=\"background:black\"></div>"
            +"<div id=\"similar-tracks\"></div>";
    }
    else{
        html += "<div style=\"text-align:center;margin-top:25%;font-size:1.6rem\">"
            + "<i class=\"fa fa-coffee fa-2x\" style=\"color:hsl(0, 0%, 53.3%);\"></i><br>"
            + (deviceLanguage && deviceLanguage.indexOf('es')>=0? "No hay nada por aqu&iacute;.<br>Selecciona un v&iacute;deo para reproducirlo.": "Nothing around here.<br>Select a video to play it.") 
        + "</div>";
    }

    return html;
}

function getDownloadsPageInitialTemplate(){
    var html = '';
    
    html += "<div id=\"downloads-empty-msg\" style=\"text-align:center;margin-top:25%;font-size:1.6rem\">"
        + "<i class=\"fa fa-download fa-2x\" style=\"color:hsl(0, 0%, 53.3%);\"></i><br>"
        + (deviceLanguage && deviceLanguage.indexOf('es')>=0? "Aqu&iacute; se mostrar&aacute;n las descargas.<br>Por el momento no hay ninguna.": "This is the download section.<br>In the mean time, is empty.") 
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
            + "<img src=\"" + imgUrl + "\" onclick=\"handlePlay('" + videoId + "','" + videoTitle + "','" + channelTitle + "','" + publishedAt + "','" + imgUrl + "')\" style=\"cursor:pointer;max-width:246px\"/>"
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

function getPlaylistTemplate(list, listDivId){
    var html = '';

    if(list && list.items && list.items.length > 0){
        html += "<div style=\"padding:14px;color:hsla(0, 100%, 100%, .88);font-size:1.6rem;font-weight:700;line-height:2rem;max-height:2rem\">"
            + (list.name? list.name : "")
        +"</div>";

        html += "<table style=\"width:100%\">";
        list.items.forEach(function (item){
            html += "<tr>"
                + "<td style=\"text-align:right;width:250px\">"
                    + "<img src=\"" + item.imgUrl + "\" onclick=\"handlePlay('" + item.id + "','" + item.videoTitle + "','" + item.channelTitle + "','" + item.publishedAt + "','" + item.imgUrl + "')\" style=\"cursor:pointer;max-width:246px\"/>"
                +"</td>"
                + "<td>"
                    + "<div onclick=\"handlePlay('" + item.id + "','" + item.videoTitle + "','" + item.channelTitle + "','" + item.publishedAt + "','" + item.imgUrl + "')\" style=\"cursor:pointer;padding:7px;font-weight:500;line-height:1.6rem;font-size:1.4rem" + (videoPlayingId == item.id? ";color:#009688":";color:hsla(0, 100%, 100%, .88)") + "\">"
                        + item.videoTitle + "<br>"
                        + "<text style=\"color:hsl(0, 0%, 53.3%);line-height:1.8rem;font-size:1.3rem;font-weight:400\">"
                            + item.channelTitle + " &#8729; " + item.publishedAt
                        +"</text>"
                    +"</div>"
                +"</td>"
                + "<td style=\"width:140px\">"
                    + "<a id=\"uptrack-btnlist-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"handleMoveItemUpFromList('" + item.id + "','" + list.id + "','" + listDivId + "')\">"
                        + "<i class=\"fa fa-arrow-up fa-2x\"></i>"
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "SUBIR" : "MOVE UP") + "</span>"
                    + "</a> "
                    + "<a id=\"downtrack-btnlist-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"handleMoveItemDownFromList('" + item.id + "','" + list.id + "','" + listDivId + "')\">"
                        + "<i class=\"fa fa-arrow-down fa-2x\"></i>"
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "BAJAR" : "MOVE DOWN") + "</span>"
                    + "</a> "
                    + "<a id=\"removetrack-btnlist-" + item.id.videoId + "\" class=\"video-action-btn nolabel tooltip\" onclick=\"handleRemoveFromList('" + item.id + "','" + list.id + "','" + listDivId + "')\">"
                        + "<i class=\"fa fa-times fa-2x\"></i> "
                        + "<span class=\"tooltiptext tooltiptext-bottom\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0 ? "ELIMINAR" : "REMOVE") + "</span>"
                    + "</a>"
                +"</td>"
            +"</tr>";
        })

        html += "</table>";
    }

    return html;
}

function getQualityListTemplate(qualityList, qualityListDivId, formatCodeSelected, videoId){
    var html = '';
    if(qualityList){
        if(qualityList.video && qualityList.video.length > 0){
            html += "<div style=\"text-align:left;padding:4px;padding-top:7px\"><strong>"
                + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "V&iacute;deo": "Video")
            +"</strong></div>";

            html += "<div class=\"video-action-btn\" " + (!formatCodeSelected? "style=\"color:#009688\"": "") + " onclick=\"handleChangeQuality('" + qualityListDivId + "','" + videoId + "','','video-control-" + videoId + "')\">" 
                + (!formatCodeSelected? "<span class=\"fa fa-check-circle\" style=\"margin-right:7px\"></span>": "") 
                + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Autom&aacute;tica" : "Auto") 
                + "<span class=\"fa fa-info-circle tooltip\" style=\"margin-left:7px\">"
                    + "<span class=\"tooltiptext tooltiptext-left\">" + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Por defecto la mejor calidad" : "By default best quality") + "</span>"
                +"</span>"
            + "</div>";

            qualityList.video.forEach(function (qVideo){
                html += "<div class=\"video-action-btn\" " + (formatCodeSelected == qVideo.format_code? "style=\"color:#009688\"": "") + " onclick=\"handleChangeQuality('" + qualityListDivId + "','" + videoId + "','" + qVideo.format_code + "','video-control-" + videoId + "')\">" 
                    + (formatCodeSelected == qVideo.format_code? "<span class=\"fa fa-check-circle\" style=\"margin-right:7px\"></span>": "") 
                    + qVideo.note.split(' ')[0] + " " + qVideo.extension  + " (" + qVideo.resolution + ")" 
                    + "<span class=\"fa fa-info-circle tooltip\" style=\"margin-left:7px\">"
                        + "<span class=\"tooltiptext tooltiptext-left\">" + qVideo.note + "</span>"
                    +"</span>"
                + "</div>";
            });
        }

        if(qualityList.videoOnly && qualityList.videoOnly.length > 0){
            html += "<div style=\"text-align:left;border-top:1px solid;padding:4px;padding-top:7px\"><strong>"
                + (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "S&oacute;lo v&iacute;deo": "Only video")
            +"</strong></div>";

            qualityList.videoOnly.forEach(function (qVideo){
                html += "<div class=\"video-action-btn\" " + (formatCodeSelected == qVideo.format_code? "style=\"color:#009688\"": "") + " onclick=\"handleChangeQuality('" + qualityListDivId + "','" + videoId + "','" + qVideo.format_code + "','video-control-" + videoId + "')\">" 
                    + (formatCodeSelected == qVideo.format_code? "<span class=\"fa fa-check-circle\" style=\"margin-right:7px\"></span>": "") 
                    + qVideo.note.split(' ')[0] + " " + qVideo.extension  + " (" + qVideo.resolution + ")"
                    + "<span class=\"fa fa-info-circle tooltip\" style=\"margin-left:7px\">"
                        + "<span class=\"tooltiptext tooltiptext-left\">" + qVideo.note + "</span>"
                    +"</span>"
                + "</div>";
            });
        }

        if(qualityList.audio && qualityList.audio.length > 0){
            html += "<div style=\"text-align:left;border-top:1px solid;padding:4px;padding-top:7px\"><strong>Audio</strong></div>"
            qualityList.audio.forEach(function (qAudio){
                html += "<div class=\"video-action-btn\" " + (formatCodeSelected == qAudio.format_code? "style=\"color:#009688\"": "") + " onclick=\"handleChangeQuality('" + qualityListDivId + "','" + videoId + "','" + qAudio.format_code + "','video-control-" + videoId + "')\">" 
                        + (formatCodeSelected == qAudio.format_code? "<span class=\"fa fa-check-circle\" style=\"margin-right:7px\"></span>": "") 
                        + " " + qAudio.extension  + " (" + qAudio.note.split(' ')[qAudio.note.split(' ').length - 1] + ")"
                        + "<span class=\"fa fa-info-circle tooltip\" style=\"margin-left:7px\">"
                            + "<span class=\"tooltiptext tooltiptext-left\">" + qAudio.note + "</span>"
                        +"</span>"
                    + "</div>";
            });
        }
    }
    return html;
}