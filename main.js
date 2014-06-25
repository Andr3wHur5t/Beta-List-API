/**
 * Created by matthew on 6/23/14.
 */
var http = require('http');
var url = require('url');

/**
 * Processor for server requests for beta-list email requests
 * @param request
 * @returns {processor}
 */
var processor = function (request) {
    var self =  this;

    /**
     * Returns true if the request url contains ; or ) characters
     * @returns {boolean}
     */
    self.containsIllegalChars = function () {
        console.log(decodeURIComponent(request.url));
        return new RegExp(/[\|&\$";,'<>\(\)]/).test(decodeURIComponent(request.url));
    };

    self.request = null;
    self.requestURL = null;

    if(self.containsIllegalChars() == false) {
        self.request = request;
        self.requestURL = url.parse(self.request.url, true);
        console.log("No illegal characters");
    }
    else{
        console.log("DUDE THERE'S AN ILLEGAL CHARACTER IN THERE!!!");
    }

    /**
     * Returns timestamp from when the function is called
     * @returns {string}
     */
    self.returnTimeStamp = function () {
        return new Date().toJSON().toString();

    };

    /**
     * Returns the proper response JSON for the API call
     * @returns {string}
     */
    self.generateResponseJSON = function () {
        var responseObject;
        if(self.containsIllegalChars())
            responseObject = {Code: 403, Response: "Error:  call contains illegal characters"};
        else
            responseObject = {Code: 200, Response: "Confirmed email request for " + self.requestURL.query.email};
        responseObject = JSON.stringify(responseObject);
        return responseObject;
    };

    /**
     * Returns the proper JSON to be stored.
     * @returns {string}
     */
    self.generateFileStoredJSON = function () {
        if(!self.containsIllegalChars()) {
            var responseObject = {
                email: self.requestURL.query.email,
                timestamp: self.returnTimeStamp()
            };
            responseObject = JSON.stringify(responseObject);
            return responseObject;
        }
        return null;
    };

    return self;
};

/**
 * Main function, Contains server itself.
 * @returns {main}
 */
var main = function () {
    var self = this;

    /**
     * This Creates the Server
     */
    self.server = http.createServer(function (request, response) {
        self.processor = processor(request);
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(self.processor.generateResponseJSON());
    });

    /**
     * This Configures the server
     */
    function configure() {
        self.server.listen(8080);
    };

    configure();
    return self;
};

main = main();


console.log("Server running at http://127.0.0.1:8000/");