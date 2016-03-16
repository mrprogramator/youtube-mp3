var app = angular.module('MainApp', []);

app.controller('MainController', function ($http, $scope, $timeout, $compile){
    
    $scope.canSearchMusic = true;
    $scope.canSearchVideo = true;
    
    $scope.musicRequestLog = [];
    $scope.videoRequestLog = [];
    
    getTitle = function (query) {
      var promise = $http({
        method: 'POST',
        url: '/get-title',
        data: {data: query}
      })
      .success(function (data, status, headers, config) {
          return data;
      })
      .error(function (data, status, headers, config) {
          return { "status": false }
      });

      return promise;
    }
    
    getMp3 = function (url, name, folderName) {
      var promise = $http({
        method: 'POST',
        url: '/get-mp3',
        data: {url: url, name: name, folderName: folderName}
      })
      .success(function (data, status, headers, config) {
          return data;
      })
      .error(function (data, status, headers, config) {
          return { "status": false }
      });

      return promise;
    }
    
    getMp4 = function (url, name, folderName) {
      var promise = $http({
        method: 'POST',
        url: '/get-mp4',
        data: {url: url, name: name, folderName: folderName}
      })
      .success(function (data, status, headers, config) {
          return data;
      })
      .error(function (data, status, headers, config) {
          return { "status": false }
      });

      return promise;
    }
    
    downloadFile = function (name) {
      var promise = $http({
        method: 'post',
        url: '/download',
        data: {name: name}
      })
      .success(function (data, status, headers, config) {
          return data;
      })
      .error(function (data, status, headers, config) {
          return { "status": false }
      });

      return promise;
    }
    
    testDownload = function () {
      downloadFile('Radiohead - Creep').then(function (promise) {
            console.log(promise.data);
            var blob = new Blob(promise.data, {type: "audio/mp3"});
            var objectUrl = URL.createObjectURL(blob);
            window.open(objectUrl);
      })
    }
    
    $scope.handleMusicRequest = function (query) {
      
      $scope.canSearchMusic = false;
      
      var log = { 
        text: "Obteniendo el título del audio...",
        loading: true,
        show: true
      }
      
      var logArray = [log];
      
      $scope.musicRequestLog.push(logArray); 
      
      
      console.log('musicRequestLog',$scope.musicRequestLog);
      getTitle(query).then(function (promise){
        console.log(promise.data);
        
        var name = promise.data;
        name = encodeName(name);
        console.log('name', name);
        
        log.text = promise.data;
        log.loading = false;
        
        var log2 = { 
          text: "Obteniendo el audio...",
          loading: true,
          show: true
        }
        logArray.push(log2);
        
        console.log('musicRequestLog',$scope.musicRequestLog);
        var folder = getFolderName();
        getMp3(query, name, folder).then(function (promise) {
          console.log(promise.data);
          
          
          $scope.musicIsLoaded = true;
          
          logArray.pop();
          folderName = promise.data;
          
          var log3 =  {
            folderName: folderName,
            folder: folder,
            url :document.origin + "/" + folderName,
            show: false
          };
          
          logArray.push(log3);
          
          console.log('musicRequestLog',$scope.musicRequestLog);
          
          if ($('#player')[0].src === "") {
            $scope.playTrack($scope.musicRequestLog.indexOf(logArray));
          }
          
          $scope.canSearchMusic = true;
        })
      })
    }
    
    
    $scope.handleVideoRequest = function (query) {
      
      $scope.canSearchVideo = false;
      
      var log = { 
        text: "Obteniendo el título del video...",
        loading: true,
        show: true
      }
      
      var logArray = [log];
      
      $scope.videoRequestLog.unshift(logArray); 
      getTitle(query).then(function (promise){
        console.log(promise.data);
        
        var name = promise.data;
        name = encodeName(name);
        
        console.log('name', name);
        
        log.text = promise.data;
        log.loading = false;
        
        var log2 = { 
          text: "Obteniendo el video...",
          loading: true,
          show: true
        }
        logArray.push(log2);
        
        var folder = getFolderName();
        
        getMp4(query, name, folder).then(function (promise) {
          console.log(promise.data);
          logArray.pop();
          var folderName = promise.data;
          
          var log3 =  {
            folderName: folderName,
            folder: folder,
            url :document.origin + "/" + folderName,
            show: false
          };
          console.log('url', log3.url);
          
          logArray.push(log3);
          $scope.canSearchVideo = true;
        })
      })
    }
    
    function downloadURI(uri, name) {
        console.log('downloading file...');
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
    }
    
    $scope.download = function (url, name) {
        console.log(url, name);
        downloadURI(url, name);
    }
    
    $scope.fullscreen = function (url) {
      window.open(url, "video", "fullscreen=yes");
    }
    
    $scope.removeItem = function(item, array) {
        var index = array.indexOf(item);
        if (index >= 0) {
            array.splice(index, 1);
        }
    }
    
    function getFolderName() {
      var random = Math.random()*1000000000 + 1;
  
      var clientIP = random.toString().split('.')[0];
      
      return clientIP + '_' + Date.now();
    }
    
    function encodeName(name) {
      name = name.replace(/"/g,"'");
      name = name.replace(/:/g," -");
      name = name.replace(/\n/g,"");
      
      return name;
    }
    
    
    $scope.playTrack = function (id) {
      
      $scope.index = id;
      
      var nextTrack = $scope.musicRequestLog[$scope.index];
      
      if (nextTrack !== undefined){
        $('#npTitle').text(nextTrack[0].text);
        $('#player')[0].src = nextTrack[nextTrack.length - 1].url;
        $('.alert.alert-info').addClass('well');
        $('.alert.alert-info').removeClass('alert alert-info');
        $('.well')[$scope.index].id = $scope.index;
        $('#' + $scope.index).removeClass('well');
        $('#' + $scope.index).addClass('alert alert-info');
        return true;
      }
      else {
        return false;
      }
    }
    
    
    $scope.next = function (){
      next();
    }
    
    $scope.previous = function (){
      previous();
    }
    
    next = function()
    {
      if (!$scope.playTrack($scope.index + 1)){
        $scope.playTrack(0);
      }
    }
    
    previous = function(compile)
    {
      if (!$scope.playTrack($scope.index - 1)){
        $scope.playTrack($scope.musicRequestLog.length -1);
      }
    }
    
    $('#player').bind('play', function() {
                      playing = true;
                      console.log('now playing');
                  }).bind('pause', function() {
                      playing = false;
                      console.log('Paused:');
                  }).bind('ended', function() {
                      next();
                  })
});