var deviceLanguage = navigator.language;

var menuItems = [
    {
        id: 'home',
        label: (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Inicio" : "Home"),
        icon: 'fa-home',
        action:'showHome()'
    },
    {
        id: 'trending',
        label: (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Tendencias" : "Trending"),
        icon: 'fa-rocket',
        action:'showTrending()',
    },
    // {
    //     id: 'playlists',
    //     label: (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Listas de reproducci&oacute;n" : "Playlists"),
    //     icon: 'fa-list',
    //     action:'showPlaylists()'
    // },
    {
        id: 'nowplaying',
        label: (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Reproduciendo" : "Now playing"),
        icon: 'fa-youtube-play',
        action:'showNowPlaying()'
    },
    {
        id: 'downloads',
        label: (deviceLanguage && deviceLanguage.indexOf('es') >= 0? "Descargas" : "Downloads"),
        icon: 'fa-download',
        action:'showDownloads()'
    }
]

function getMenuTemplate(itemSelectedId){
    var html = '';
    
    menuItems.forEach(function (item){
        html += "<div class=\"menu-item " + (item.id == itemSelectedId ? "selected": "") + "\" onclick=\"" + item.action + "\">"
        + "<i class=\"fa " + item.icon + " fa-2x\"></i> " 
        + "<text>"
            + item.label
        + "</text>"
    + "</div>";
    });

    return html;
}