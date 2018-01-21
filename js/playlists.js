function loadPlaylists(onSuccess, onError) {
    try
    {
        var playlistsText = localStorage.getItem('coco-playlists');
        if(playlistsText) {
            var playlists = JSON.parse(playlistsText);
            onSuccess(playlists);
        }
        else{
            onSuccess([]);
        }
    }
    catch(error)
    {
        onError();
    }
}