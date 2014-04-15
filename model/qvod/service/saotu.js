/**
 * Date: 14-2-14
 * Time: 下午4:29
 */
var http = require('http');
var qs=require('querystring');
var msg = require('../../../support').customMsg;
var movie = require('./movie');
var md5 = require('../../../support').md5;
var cfg = require('../../config');


var default_title = ['找到最匹配的明星，以下是TA的影片：','http://m.yunfan.com'];



function sign(qs){
    console.log(qs)
    var KEY = 'a0c74a82613bd7266c158e3f41286af7';
    var sign = md5(qs);
    sign = md5(sign + KEY);
    console.log(sign)
    return sign;
}


function saotu(img_url,callback){
//    var options = {
//        host:'saotu.kuaibo.com',
//        port:80,
//        path:'//interface/?cmd=scanimg&imgurl='+img_url+'&device=0&device=0&multifacenum=1&ver=3.3.25',
//        method:'GET'
//    }
   var qs = 'cmd=scanimgforprivate&imgurl='+encodeURIComponent(img_url)+'&qvodmail='+encodeURIComponent('lvzhuo@qvod.com')+'&timestamp='+Math.floor(new Date().getTime()/1000);
    //var qs = 'cmd=scanimgforprivate&imgurl=https://mp.weixin.qq.com/cgi-bin/getheadimg?fakeid=3076018035&qvodmail=lvzhuo@qvod.com&timestamp=1392712693';

    var options = {
        host:'sao.zol.so',
        port:80,
        //path:'/interface/?cmd=scanimgforprivate&qvodmail=majianchun@qvod.com&imgurl='+img_url,
        path:'/interface/?'+qs+'&sign='+sign(qs),
        method:'GET'
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
            console.log("saotu result===",_data)

            // _callback(_data)

            //正式版要解密
            //aes({dec:_data},_callback)

            //内部版不解密，但是加了签名

            var data;
            try{
                data = JSON.parse(_data);

            }catch(e){
                return  _callback(null,msg('text','Sorry ！没有识别到哦，请发送正脸无码大头照！'))
            }



            var list = data.data;
            if(list && list.length > 0){

                var name = list[0].searchName;
                var face = list[0].imageUrl;
                var s = list[0].similarity;
                default_title[2] = face;


                var rank = getRankBySimilarity(s);

//                toShort(img_url,function(data){
//                    img_url = data;
//
//                    toShort(face,function(data){
//                        face = data;
//
//                    })
//                });


                return _callback(null,msg('news',[[
                    '像你的明星是:'+name+'(相貌排名为'+rank+'位)',
                    cfg.URL+'/act/starface/?user='+escape(img_url)+'&star='+escape(face)+'&name='+escape(encodeURI(name))+'&rank='+rank+'&s='+s,
                    img_url,
                    '连'+name+'都拜倒了！'
                ]]))





            }else{
                return  _callback(null,msg('text','Sorry ！没有识别到哦，请发送正脸无码大头照！'+data.reason))
            }



        });
    })

    req.end();


}


/**
 * 短地址
 * @type {exports}
 */
var util = require('../../utils')
function toShort(url,callback){
  //  console.log('=====http://u3j.net/index.php?info=api&alias=&url='+url)
    util.HttpGet('http://u3j.net/index.php?info=api&alias=&url='+url,function(err,data){
        console.log(err,JSON.parse(data.toString()).url);

        callback(JSON.parse(data.toString()).url);
    });
}

/**
 *
 * @param s 相似度
 * @returns {number}
 */
function getRankBySimilarity(s){
    if(s-5<=0){
        return 10000+Math.floor(Math.random()*100);
    }else if(100-s<=0){
        return Math.floor(Math.random()*10);
    }


    var rank_max = 10+100*(100-(s-5));
    var rank_min = 10+100*(100-s);

    console.log(rank_max,rank_min);

    return(rank_min+Math.floor(Math.random()*(rank_max-rank_min)))
}



function aes(data,callback){
    var content=qs.stringify(data);
    var options = {
        host: 'rianow.duapp.com',
        port: 80,
        path: '/app/api/aes.php',
        method: 'POST',
        headers:{
            "Content-Length":content.length,
            "Content-Type":"application/x-www-form-urlencoded"
        }
    };

    var req = http.request(options,function(res){
        var _callback = callback;
        // console.log("statusCode: ", res.statusCode);
        //console.log("headers: ", res.headers);
        var _data='';
        res.on('data', function(chunk){
            _data += chunk;
        });
        res.on('end', function(){
            console.log(_data)
            var data;
            try{
                data = JSON.parse(_data);

            }catch(e){
                return  _callback(null,msg('text','Sorry , 未找到相关明星和影片！'))
            }

            console.log("aes result===",data)

            var list = data.data;
            if(list && list.length > 0){

                var name = list[0].searchName;
                var face = list[0].imageUrl;
                default_title[2] = face;

                soupian(name,_callback,default_title);



            }else{
               return  _callback(null,msg('text','Sorry , 未找到相关明星和影片！'))
            }



        });
    })
    req.write(content)
    req.end();

}


module.exports = saotu;



