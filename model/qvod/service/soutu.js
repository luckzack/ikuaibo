/**
 * Date: 14-2-16
 * Time: 下午7:50
 */

//api:https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=%E5%90%89%E6%B3%BD%E6%98%8E%E6%AD%A5


var http = require('http');
var msg = require('../../support').customMsg;

module.exports = function(name,callback){
    var options = {
        host:'ajax.googleapis.com',
        port:'80',
        path:'/ajax/services/search/images?v=1.0&q='+encodeURI(name)+'&rsz=1',
        method:'GET',
        referer:'www.example.com'

    }

    var req = http.request(options,function(res){
        var _callback = callback;

        //console.log("statusCode: ", res.statusCode);
        //console.log("headers: ", res.headers);
        var _data='';
        res.on('data', function(chunk){
            _data += chunk;
        });
        res.on('end', function(){
            var data = JSON.parse(_data);
            var results = data.responseData.results;
            console.log("saotu result===",data)

            if(results && results.length > 0){

                var idx = Math.floor(Math.random()*results.length);
                return _callback(null,msg('pic',[results[idx].contentNoFormatting,results[idx].originalContextUrl,results[idx].url]))


            }else{
                return _callback(null,msg('text','Sorry , 未找到相关图片！'))
            }


            var result = []


        });


    });

    req.end();
}

