/**
 * Date: 14-1-4
 * Time: 下午3:36
 */
var https = require('https'),
    parse = require('url').parse,
    http = require('http');


/**
 *
 * @param url {String}
 * @param callback {Function}
 * @constructor
 */
function HttpGet(url, callback) {
    var info = parse(url)
        , path = info.pathname + (info.search || '')
        , options = { host: info.hostname,
            port: info.port || 80,
            path: path,
            method: 'GET' };

    console.log('!!!HttpGet',options)

    var req = http.request(options, function(res) {
        var chunks = [], length = 0;
        res.on('data', function(chunk) {
            length += chunk.length;
            chunks.push(chunk);

        }).on('end', function() {
                var data = new Buffer(length), pos = 0
                    , l = chunks.length;
                for(var i = 0; i < l; i++) {
                    chunks[i].copy(data, pos);
                    pos += chunks[i].length;
                }
                res.body = data;

                callback(null, data);
            }).on('error', function(err) {

                callback(err,null);
            });
    }).on('error', function(err) {
            callback(err,null);

        });
    req.end();
};

function HttpsGet(url, callback) {
    var info = parse(url)
        , path = info.pathname + (info.search || '')
        , options = { host: info.hostname,
            port: info.port || 443,
            path: path,
            method: 'GET' };
    var req = https.request(options, function(res) {
        var chunks = [], length = 0;
        res.on('data', function(chunk) {
            length += chunk.length;
            chunks.push(chunk);

        }).on('end', function() {
                var data = new Buffer(length), pos = 0
                    , l = chunks.length;
                for(var i = 0; i < l; i++) {
                    chunks[i].copy(data, pos);
                    pos += chunks[i].length;
                }
                res.body = data;

                callback(null, res);
            }).on('error', function(err) {

                callback(err, 22);
            });
    }).on('error', function(err) {
            callback(err);
            console.log(11)
        });
    req.end();
};

function HttpsPost(url,json,callback){

    console.log(json)
    var info = parse(url)
        , path = info.pathname + (info.search || '')
        , options = { host: info.hostname,
            port: info.port || 443,
            path: path,
            method: 'POST'
        };
    var req = https.request(options, function(res) {
        var chunks = [], length = 0;
        res.on('data', function(chunk) {
            length += chunk.length;
            chunks.push(chunk);

        }).on('end', function() {
                var data = new Buffer(length), pos = 0
                    , l = chunks.length;
                for(var i = 0; i < l; i++) {
                    chunks[i].copy(data, pos);
                    pos += chunks[i].length;
                }
                res.body = data;

                callback(null, res);
            }).on('error', function(err) {

                callback(err, 22);
            });
    }).on('error', function(err) {
            callback(err);
            console.log(11)
        });
    req.write(json);
    req.end();


}


module.exports = {
    HttpGet:HttpGet,
    HttpsGet:HttpsGet,
    HttpsPost:HttpsPost
}
