var express = require('express');
var app = express();
//var youtubedl = require('youtube-dl');

app.use(express.static(__dirname + ''));

var http = require('http');
var https = require('https');
var httpServer = http.Server(app);
var io = require('socket.io')(httpServer);

var child_process = require('child_process');
var fs = require('fs');
var glob = require('glob');

var ms = require('mediaserver');

httpServer.listen(process.env.PORT || 8080, function(){
  console.log('listening on :', process.env.PORT || 8080);
  
  var upgradeProcess = child_process.spawn("./youtube-dl",['-U']);
  var logProccess = "";
  upgradeProcess.stdout.on('data', function (data) {
      logProccess += data.toString();
      
  });

  upgradeProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
  });
  
  upgradeProcess.on('exit', function () {
      console.log(logProccess);
  })
});

io.on('connection', function(socket){
    console.log('a client is connected', socket.id);
});

app.get('/getimg', function (req, res){
    var videoId = req.query.videoId;
    var fileName = encodeURIComponent(req.query.fileName);

    https.get('https://i.ytimg.com/vi/' + videoId + '/' + fileName, function(promise){
        promise.pipe(res);
    }).on("error", function(e){
        console.log("Got error: " + e.message);
        res.send(null);
    });
})

app.post('/getqualitylist', function (req, res){
    var videoId = req.query.videoId;
    var process = child_process.spawn('./youtube-dl',['-F', videoId]);
    var qualityResponse = "";
    process.stdout.on('data', function (data) {
        qualityResponse += data;
    });
    
    process.on('exit', function (code) {
        var qualityCleanerResponse = qualityResponse.split(/\n/).filter(function (q) { 
            return q.indexOf('[') === -1 && q.indexOf(']') === -1 
        });

        var qualityList = {
            audio: [],
            videoOnly: [],
            video: []
        };
        qualityCleanerResponse.shift();

        qualityCleanerResponse.forEach(function (responseItem) {
            if(responseItem){
                var i = 0;
                var qualityItem = {};
                var itemProps = responseItem.split(' ');
    
                qualityItem = {
                    format_code: parseInt(itemProps[i]),
                }
    
                ++i;
    
                while(!itemProps[i] && i < itemProps.length){
                    ++i;
                }
    
                if(itemProps[i]){
                    qualityItem.extension = itemProps[i];
                    qualityItem.extension = qualityItem.extension.trim();
                    ++i;
                }
    
                while(!itemProps[i] && i < itemProps.length){
                    ++i;
                }
    
                if(itemProps[i]){
                    qualityItem.resolution = itemProps[i] + " " + itemProps[i + 1];
                    qualityItem.resolution = qualityItem.resolution.trim();
                    i += 2;
                }
    
                qualityItem.note = '';
    
                while(i < itemProps.length){
                    qualityItem.note += itemProps[i] + " ";
                    ++i;
                }

                qualityItem.note = qualityItem.note.trim();

                if(qualityItem.resolution.indexOf('audio') >= 0){
                    qualityList.audio.push(qualityItem);
                }
                else if(qualityItem.note.indexOf('video only') >= 0){
                    qualityList.videoOnly.push(qualityItem);
                }
                else{
                    qualityList.video.push(qualityItem);
                }
            }
        })

        // qualityList.audio = qualityList.audio.sort(function (a,b){ return a.format_code < b.format_code });
        // qualityList.video = qualityList.video.sort(function (a,b){ return a.format_code < b.format_code });
        res.send(qualityList);
    });
});

app.post('/search', function (req, res){
    var resultsCount = (JSON.parse(req.query.resultsCount) ? req.query.resultsCount: 7);
    var indication = encodeURIComponent(req.query.indication);

    https.get('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=' + resultsCount + '&q=' 
    + indication + '&type=video&key=AIzaSyB5aNLXS6p869esiJFZMxsoxniDDWvmEgg', function(promise){
        promise.pipe(res);
    }).on("error", function(e){
        res.send(null);
    });
})

app.post('/related', function (req, res){
    var resultsCount = (JSON.parse(req.query.resultsCount) ? req.query.resultsCount: 7);
    var indication = encodeURIComponent(req.query.indication);

    https.get('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=' + resultsCount + '&relatedToVideoId=' 
    + indication + '&type=video&key=AIzaSyB5aNLXS6p869esiJFZMxsoxniDDWvmEgg', function(promise){
        promise.pipe(res);
    }).on("error", function(e){
        res.send(null);
    });
})

app.get('/stream', function (req, res){
    var videoId = req.query.videoId;
    var videoFormat = req.query.videoFormat;
    //var video = youtubedl(videoId,(videoFormat? ['--format=' + videoFormat]: []));
    //video.pipe(res);

    //video.on('error', function error(err) {
    //    console.log('error:', err);
    //    res.send(null);
    //});
})

app.post('/get-mp3', function (req, res){
    var videoId = req.query.videoId;
    var folderName = req.query.folderName;
    var socketId = req.query.socketId;
    var currentClient = io.sockets.connected[socketId];
    
    res.send(true);

    fs.mkdir(folderName, function () {
        var process = child_process.spawn('./youtube-dl',
        ['--ffmpeg-location','./ffmpeg','-o',
        folderName + "/%(title)s.%(ext)s",
        '--no-playlist','--extract-audio','--audio-format','mp3',
        '--default-search','ytsearch', videoId]);

        process.stdout.on('data', function (data) {
            if (currentClient){
                currentClient.emit('data', data.toString());
            }
        });

        process.on('exit', function (code, data) {
            if (currentClient){
                currentClient.emit('finish');
            }
        });
    })
})

app.post('/get-mp4', function (req, res){
    var videoId = req.query.videoId;
    var folderName = req.query.folderName;
    var socketId = req.query.socketId;
    var currentClient = io.sockets.connected[socketId];
    
    res.send(true);

    fs.mkdir(folderName, function () {
        var process = child_process.spawn("./youtube-dl",
            ['--ffmpeg-location','./ffmpeg','-o',
            folderName + "/%(title)s.%(ext)s",'--format',
            'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best','--no-playlist','--default-search','ytsearch', videoId]);

        process.stdout.on('data', function (data) {
            if (currentClient){
                currentClient.emit('data', data.toString());
            }
        });

        process.on('exit', function (code, data) {
            if (currentClient){
                currentClient.emit('finish');
            }
        });
    })
})

app.post('/direct-download', function (req, res){
    var videoId = req.query.videoId;
    var folderName = req.query.folderName;
    var socketId = req.query.socketId;
    var currentClient = io.sockets.connected[socketId];
    
    res.send(true);

    fs.mkdir(folderName, function () {
        var downloadParams = ['--ffmpeg-location','./ffmpeg','-o',
        folderName + "/%(title)s.%(ext)s"];
        downloadParams = downloadParams.concat(videoId.split(' '));

        var process = child_process.spawn("./youtube-dl",
            downloadParams);

        process.stdout.on('data', function (data) {
            if (currentClient){
                currentClient.emit('data', data.toString());
            }
        });

        process.on('exit', function (code, data) {
            if (currentClient){
                currentClient.emit('finish');
            }
        });
    })
})

app.get('/get-media', function (req, res){
    var folderName = req.query.folderName;

    glob(folderName + "/*", function (err, files) {
        if(!files || files.length === 0) {
            res.send(false);
        }
        else{
            var file = files[0];
            
            if(file){
                var fileExt = file.split('.')[1];
                
                if(fileExt == 'mp3'){
                    ms.pipe(req, res,file,'audio/mp3');
                }
                else if(fileExt == 'mp4'){
                    ms.pipe(req, res, file, 'video/mpeg');
                }
                else{
                    ms.pipe(req, res, file, 'audio/webm');
                }
            }
            else{
                res.send(false);
            }
        }
    })
})

app.post('/download', function(req, res) {
    var folderName = req.query.folderName;
    glob(folderName + "/*", function (err, files) {
        if(files == 0) {
            res.send(false);
        }

        var file = files[0];

        res.download(file);

        res.on('finish', function () {
            var proccess = child_process.spawn('rm',['-r',folderName]);
        });
    })
})

app.get('/upgrade', function (req, res) {
    var process = child_process.spawn("./youtube-dl",['-U']);

    var logProccess = "";
    process.stdout.on('data', function (data) {
        logProccess += data.toString();
        
    });

    process.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    
    process.on('exit', function () {
        res.send(logProccess);
    })
});

app.get('/version', function (req, res) {
    var process = child_process.spawn("./youtube-dl",['--version']);

    var logProccess = "";
    process.stdout.on('data', function (data) {
        logProccess += data.toString();
        
    });

    process.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    
    process.on('exit', function () {
        res.send(logProccess);
    })
});
