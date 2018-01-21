function search(searchText, resultsCount, onSuccess, onError){
    makeHTTPRequest('/search?resultsCount=' + resultsCount + '&indication=' + searchText,'POST', function (response){
        response = JSON.parse(response);
        onSuccess(response);
    }, function (){
        onError();
    });
}