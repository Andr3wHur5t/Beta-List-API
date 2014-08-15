/**
 * Created by matthew on 6/23/14.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');
var koa = require('koa');
var koaJsonBody = require('koa-json-body');
var app = koa();

app.use(koaJsonBody({ limit: '10kb' }));

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
        return new RegExp(/[\|&\$";,'<>\(\)]/).test(request.body.email);
    };

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
            responseObject = {Code: 200, Response: "Confirmed email request for " + self.passedInEmail};
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


    self.request = null;
    self.passedInEmail = null;
    //set RequestURL only if the file is not an xss attack...
    if(self.containsIllegalChars() == false) {
        self.passedInEmail = request.body.email;
    }

    return self;
};

/**
 * Manager for file Input and output
 * @returns {IOManager}
 * @constructor
 */
var IOManager = function (){
    var self = this;
    self.file = 'docs/emails.json';
    self.closed = false;

    /**
     * Appends JSON into storage file.
     * @param JSONToAppend
     */
    self.appendJSON = function ( JSONToAppend ) {
        console.log("I am going to append...: " +JSONToAppend);
        if (!self.closed) {
            if (fs.existsSync(self.file)) {
                testString = fs.appendFileSync(self.file, ',\n        ' + JSONToAppend);
            }
            else {
                console.log("file not found creating new file");
                fs.writeFileSync(self.file, '{"elements":[\n        ' + JSONToAppend);
            }
        }
    };

    self.closeJSON = function (  ) {
        fs.appendFileSync(self.file, '\n]}');
        self.closed = true;
    };
    return self;
};

/**
 * Main function, Contains server itself.
 * @returns {main}
 */
var main = function () {
    var self = this;

    self.IOManager = IOManager();

    app.use(function *() {
        self.processor = processor(this.request);
        this.response.body = (self.processor.generateResponseJSON());
        self.IOManager.appendJSON(self.processor.passedInEmail);
    });

    app.listen(8000);

    return self;
};

main = main();


console.log("Server running at http://127.0.0.1:8000/");