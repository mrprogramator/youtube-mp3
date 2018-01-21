function makeHTTPRequest(url, method, onSuccess, onError){
    try
    {
        var request = new XMLHttpRequest();

        request.open(method,url, true);

        request.onreadystatechange = function (){
            if (request.readyState == XMLHttpRequest.DONE) {
                onSuccess(request.responseText);
            }
        };

        request.onerror = onError;

        request.send();
    }
    catch(exception)
    {
        onError(exception);
    }
}