var playlistsList = [];

function loadSavedPlaylists() {
    playlistsList = localStorage.getItem('coco-storaged-lists');
    
    if(!playlistsList)
        playlistsList = [];
    else
        playlistsList = JSON.parse(playlistsList);
}


function getList(id) {
    return playlistsList.filter(function (p) { return p.id == id })[0]
}

function addList(name, save){
    playlist = {
        id: playlistsList.length + 1,
        name: name,
        save: save,
        items: []
    };

    playlistsList.push(playlist);

    if(save === true) {
        var storagedLists = localStorage.getItem('coco-storaged-lists');

        if(!storagedLists)
            storagedLists = [];
        else
            storagedLists = JSON.parse(storagedLists);

        storagedLists.push(playlist);
        localStorage.setItem('coco-storaged-lists', JSON.stringify(storagedLists));
    }

    return playlist.id;
}

function removeList(id){
    var playlist = getList(id);
    
    if(playlist){
        playlistsList = removeItemFromArray(playlist, playlistsList);

        if(playlist.save === true){
            var storagedLists = localStorage.getItem('coco-storaged-lists');
        
            if(storagedLists){
                storagedLists = JSON.parse(storagedLists);
                var storagedItem = storagedLists.filter(function (s) { return s.id == id })[0];

                if(storagedItem){
                    storagedLists = removeItemFromArray(storagedItem, storagedLists);
                    localStorage.setItem('coco-storaged-lists', JSON.stringify(storagedLists));
                }
            }
        }
    }
}

function addItemToList(item, listId){
    var playlist = getList(listId);

    if(playlist){
        playlist.items.push(item);

        if(playlist.save === true){
            var storagedLists = localStorage.getItem('coco-storaged-lists');
        
            if(storagedLists){
                storagedLists = JSON.parse(storagedLists);
                var storagedPlaylist = storagedLists.filter(function (s) { return s.id == listId })[0];

                if(storagedPlaylist){
                    storagedPlaylist.items = playlist.items;
                    localStorage.setItem('coco-storaged-lists', JSON.stringify(storagedLists));
                }
            }
        }
    }
}

function removeItemFromList(itemId, listId){
    var playlist = getList(listId);

    if(playlist){
        var item = playlist.items.filter(function (i) { return i.id == itemId })[0];

        if(item){
            playlist.items = removeItemFromArray(item, playlist.items);
            
            if(playlist.save === true){
                var storagedLists = localStorage.getItem('coco-storaged-lists');
            
                if(storagedLists){
                    storagedLists = JSON.parse(storagedLists);
                    var storagedPlaylist = storagedLists.filter(function (s) { return s.id == listId })[0];
    
                    if(storagedPlaylist){
                        storagedPlaylist.items = playlist.items;
                        localStorage.setItem('coco-storaged-lists', JSON.stringify(storagedLists));
                    }
                }
            }
        }
    }

    return playlist;
}

function removeItemFromArray(item, array){
    var itemIndex = array.indexOf(item);

    if(itemIndex >= 0)
        array.splice(itemIndex, 1);

    return array;
}

function moveItemUp(itemId, listId) {
    var list = getList(listId);

    if(list && list.items && list.items.length > 0) {
        var item = list.items.filter(function (i) { return i.id == itemId })[0];
        
        if(item){
            var itemIndex = list.items.indexOf(item);
            
            if(itemIndex > 0){
                var previousItem = list.items[itemIndex - 1];
                list.items[itemIndex - 1] = item;
                list.items[itemIndex] = previousItem;
            }
        }
        
        if(list.save === true){
            var storagedLists = localStorage.getItem('coco-storaged-lists');
        
            if(storagedLists){
                storagedLists = JSON.parse(storagedLists);
                var storagedPlaylist = storagedLists.filter(function (s) { return s.id == listId })[0];

                if(storagedPlaylist){
                    storagedPlaylist.items = list.items;
                    localStorage.setItem('coco-storaged-lists', JSON.stringify(storagedLists));
                }
            }
        }
    }
    
    return list;
};

function moveItemDown(itemId, listId) {
    var list = getList(listId);

    if(list && list.items && list.items.length > 0) {
        var item = list.items.filter(function (i) { return i.id == itemId })[0];
        
        if(item){
            var itemIndex = list.items.indexOf(item);
            
            if(itemIndex <= list.items.length - 2){
                var previousItem = list.items[itemIndex + 1];
                list.items[itemIndex + 1] = item;
                list.items[itemIndex] = previousItem;

                if(list.save === true){
                    var storagedLists = localStorage.getItem('coco-storaged-lists');
                
                    if(storagedLists){
                        storagedLists = JSON.parse(storagedLists);
                        var storagedPlaylist = storagedLists.filter(function (s) { return s.id == listId })[0];
        
                        if(storagedPlaylist){
                            storagedPlaylist.items = list.items;
                            localStorage.setItem('coco-storaged-lists', JSON.stringify(storagedLists));
                        }
                    }
                }
            }
        }
    }

    return list;
}