var app = angular.module('MainApp', []);

app.controller('MainController', function ($http, $scope, $timeout){
    
    $scope.canSearchMusic = true;
    $scope.canSearchVideo = true;
    
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
    
    getMp3 = function (url, name) {
      var promise = $http({
        method: 'POST',
        url: '/get-mp3',
        data: {url: url, name: name}
      })
      .success(function (data, status, headers, config) {
          return data;
      })
      .error(function (data, status, headers, config) {
          return { "status": false }
      });

      return promise;
    }
    
    getMp4 = function (url, name) {
      var promise = $http({
        method: 'POST',
        url: '/get-mp4',
        data: {url: url, name: name}
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
      
      $scope.musicRequestLog = [];
      
      $scope.canSearchMusic = false;
      
      var log = { text: "Obteniendo el título del audio...", loading: true}
      
      $scope.musicRequestLog.push(log); 
      getTitle(query).then(function (promise){
        console.log(promise.data);
        
        $scope.name = promise.data;
        $scope.name = $scope.name.substring(0, $scope.name.length - 1);
        
        log.text = "Título: " + promise.data;
        log.loading = false;
        var log2 = { text: "Obteniendo el audio...", loading: true}
        $scope.musicRequestLog.push(log2); 
        getMp3(query, $scope.name).then(function (promise) {
          console.log(promise.data);
          
          $scope.folderMusicName = promise.data;
          
          $scope.musicRequestLog.pop(); 
          
          
          $scope.canSearchMusic = true;
          
          $scope.audioUrl = document.origin + "/" + $scope.folderMusicName + "/"+ $scope.name + ".mp3";
        })
      })
    }
    
    $scope.handleVideoRequest = function (query) {
      
      $scope.videoRequestLog = [];
      
      $scope.canSearchVideo = false;
      
      var log = { text: "Obteniendo el título del video...", loading: true}
      
      $scope.videoRequestLog.push(log); 
      getTitle(query).then(function (promise){
        console.log(promise.data);
        
        $scope.videoName = promise.data;
        $scope.videoName = $scope.videoName.substring(0, $scope.videoName.length - 1);
        
        log.text = "Título: " + promise.data;
        log.loading = false;
        var log2 = { text: "Obteniendo el video...", loading: true}
        $scope.videoRequestLog.push(log2); 
        getMp4(query, $scope.videoName).then(function (promise) {
          console.log(promise.data);
          
          $scope.folderVideoName = promise.data;
          
          $scope.videoRequestLog.pop(); 
          
          log2.text = log2.text + " Listo";
          log2.loading = false;
          
          $scope.canSearchVideo = true;
          
          $scope.videoUrl = document.origin + "/" + $scope.folderVideoName + "/" + $scope.videoName + ".mp4";
          console.log('VIDEO URL', $scope.videoUrl);
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
});