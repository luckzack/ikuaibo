/**
 * Date: 2014/4/14
 * Time: 15:02
 * 根据经纬度查找附近影片
 * page：http://sq.kb.cn/kbsq/wiki/docs/api/radar
 * api:http://mobile.kuaibo.com/radar/nodes/scan/
 */

var httpget = require('../../utils').HttpGet;
var msg = require('../../../support').customMsg;

var movie = require('./movie');

module.exports = radar;


function radar(loc,callback){
   var result;
   var nodes;


   httpget('http://mobile.kuaibo.com/radar/nodes/scan/?lat='+loc.lat+'&lng='+loc.lng,function($err,$result){

       result = JSON.parse($result.toString())
       nodes = result.data.nodes;
       console.log(result)


       if(result.data && result.data.address){
           var address =  (result.data.address.split(','))[0];


           movie.getRandom(movie.type.zy,5,function(err,output){

               if(output){

                   return callback(null,msg('news',output));

               } else{
                   return callback(null,msg('text',output));
               }

           })

           return  callback(null,msg('news',[['您在：'+result.data.city+' '+address+'附近'],['为您找到如下影片：']]))
       }else{
           return callback(null,msg('text','Sorry , 未找到相关影片！'))
       }



   });

}

