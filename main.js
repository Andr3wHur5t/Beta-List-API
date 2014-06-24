/**
 * Created by matthew on 6/23/14.
 */
var http = require('http');
var url = require('url');

/**
 * beta-list server:  processes requests for beta invitations.
 * @returns {*}
 */
var server = function () {
    var self = http.createServer(function (request, response) {
        self.processor = processor(request);
        response.writeHead(200, {"Content-Type": "text/plain"});
        if(self.processor.containsIllegalChars())
            response.end("Error 403 :  illegal characters detected in API call");
        response.end("200:  added email to beta-list.");
    });
    return self;
};

/**
 * Processor for server requests
 * @param request
 * @returns {processor}
 */
var processor = function (request) {
    var self = this;

    self.request = request;
   // self.requestURL = url.parse(self.request.u);

    /**
     * Returns true if the request url contains ; or ) characters
     * @returns {boolean}
     */
    self.containsIllegalChars = function () {
        return (self.request.url.indexOf(';') != -1 || self.request.url.indexOf(')') != -1);
    };

    /**
     * Returns timestamp from when the function is called
     * @returns {string}
     */
    self.returnTimeStamp = function () {
        var a = new Date(Date.now());
        var hour = a.getUTCHours();
        var min = a.getUTCMinutes();
        var sec = a.getUTCSeconds();

        return hour + ":" + min + ":" + sec + " (UTC+0000 Standard Time)";
    };

    return self;
};

/**
 * Main function, Contains server itself.
 * @returns {main}
 */
var main = function () {
    var self = this;
    self.server = server();
    return self;
};

main = main();

main.server.listen(8080);

console.log("Server running at http://127.0.0.1:8000/");