function search(searchText, resultsCount, onSuccess, onError){
    makeHTTPRequest('/search?resultsCount=' + resultsCount + '&indication=' + searchText,'POST', function (response){
        response = JSON.parse(response);
        onSuccess(response);
    }, function (){
        onError();
    });
}

function related(searchText, resultsCount, onSuccess, onError){
    makeHTTPRequest('/related?resultsCount=' + resultsCount + '&indication=' + searchText,'POST', function (response){
        response = JSON.parse(response);
        onSuccess(response);
    }, function (){
        onError();
    });
}

function getQualityList(videoId, onSuccess, onError){
    makeHTTPRequest('/getqualitylist?videoId=' + videoId,'POST', function (response){
        response = JSON.parse(response);
        onSuccess(response);
    }, function (){
        onError();
    });
}