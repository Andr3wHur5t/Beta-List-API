/**
 * Created by matthew on 6/23/14.
 */
var server = require('http').createServer(function (request, response) {
    var uri = request.url.toString();
    response.writeHead(200, {"Content-Type": "text/plain"});

    if(uri.indexOf(';') != -1 || uri.indexOf(')') != -1){
        console.log("; or ) character detected!!!");
        response.end("Error 403: address contains illegal characters");
    }


    response.end("Successfully added email address (well not really, but I swear it will soon!.")
});

server.listen(8080);
console.log("Server running at http://127.0.0.1:8000/");