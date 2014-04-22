/**
 * Date: 2014/3/27
 * Time: 16:31
 *
 * yunfan影片接口
 */
var http_get = require('../../utils').HttpGet;
var msg = require('../../../support').customMsg;

var SEARCH = 'http://www.yunfan.com/api/search/?q=';
var GETNEW = 'http://www.yunfan.com/api/dianying/list.php?showtype=bigimg&list=1&rank=createtime&cat=all&year=all&area=all&act=';
var GETHOT = 'http://www.yunfan.com/api/dianying/list.php?showtype=bigimg&list=1&rank=rankhot&cat=all&year=all&area=all&act=';

var LINK = 'http://m.yunfan.com/s.php?q=';
var SEARCH_TITLE = ['为你找到以下影片：','http://m.yunfan.com'];
var NEW_TITLE = ['为你找到最新影片：','http://m.yunfan.com'];
var HOT_TITLE = ['为你找到最热影片：','http://m.yunfan.com'];






function search(name,callback){
    http_get(SEARCH+name,function(err,data){
        console.log('search====',err,data.toString())


        try{
            data =  JSON.parse(data.toString());
        } catch(e){
            //return msg('text','Sorry , 未找到相关影片！');
            return callback(null,msg('text','Sorry , 未找到相关影片！'))
        }
        var list = data.long_result;


        if(list && list.length > 0){
            var result = [SEARCH_TITLE];


            for(var i in list){
                var name = getName(list[i].title);

                result.push([name,LINK+name,list[i].cover])
            }
           // return msg('news',result);
            return callback(null,msg('news',result));
        }else{
            //return msg('text','Sorry , 未找到相关影片！');
            return callback(null,msg('text','Sorry , 未找到相关影片！'))
        }


    })

}

function getNew(callback){
    http_get(GETNEW,function(err,data){
        try{
            data =  JSON.parse(data.toString());
        } catch(e){
            return callback(null,msg('text','Sorry , 未找到相关影片！'))
        }
        var list = data.result;


        if(list && list.length > 0){
            var result = [NEW_TITLE];


            for(var i in list){
                var name = getName(list[i].title);

                result.push([name,LINK+name,list[i].cover]);
                if(i>=4) break;
            }
            return callback(null,msg('news',result));
        }else{
            return callback(null,msg('text','Sorry , 未找到相关影片！'))
        }
    })
}


function getHot(callback){
    http_get(GETHOT,function(err,data){
        try{
            data =  JSON.parse(data.toString());
        } catch(e){
            return callback(null,msg('text','Sorry , 未找到相关影片！'))
        }
        var list = data.result;


        if(list && list.length > 0){
            var result = [HOT_TITLE];


            for(var i in list){
                var name = getName(list[i].title);

                result.push([name,LINK+name,list[i].cover]);
                if(i>=4) break;
            }
            return callback(null,msg('news',result));
        }else{
            return callback(null,msg('text','Sorry , 未找到相关影片！'))
        }
    })

}


/**
 * 获取快播宣传影片，已有的地址
 * @param callback
 */
function getQvodADMovie(callback){
    return callback(null,msg('news',[
        ['快播小方发布','http://v.youku.com/v_show/id_XNjEyNjA5OTI4.html',''],
        ['快播大屏幕宣传片——《分享·感动》','http://v.youku.com/v_show/id_XNDM4NjMzMzky.html','']
    ]));
}


/**
 * 去掉影片名的html元素
 * @param v
 * @returns {*}
 */
function getName(v){
    var p0 = v.match(/>.*</i);



    if(p0 && p0.length > 0){
        var head = v.split('<')[0];
        var foot = v.split('>')[v.split('>').length-1]


        var p = p0[0]
        var ary = p.split('>')
        var ary1 = ary[1];

        return  head + ary1.split('<')[0] + foot;
    } else{
        return v;
    }

}

/**  以下接口“雷达”使用
 *
 * 取到影片id后，按规则拼成影片介绍页和影片T图地址
 *
 * 介绍页：http://m.yunfan.com/#/mo/7475734361652700469     ,mo,tv,ct,va
 * T图：http://img.yunfan.com/index.php?mid=middle_1914960785692076728&t=m
 *
 **/
var DIANYING = 'http://s.yunfan.com/wx/dy1.js';
var DIANSHIJU = 'http://s.yunfan.com/wx/tv1.js';
var DONGMAN = 'http://s.yunfan.com/wx/dm1.js';
var ZONGYI = 'http://s.yunfan.com/wx/zy1.js';


function getRandom(type,count,callback){



    var api = type['api'];
    var key = type['key'];



    http_get(api,function(err,data){
        try{
            data =  JSON.parse(data.toString());
        } catch(e){
            //return callback(null,msg('text','Sorry , 未找到相关影片！'));
            return callback('Sorry , 未找到相关影片！',null);
        }

        var list = [];
        for(var i in data){
            list.push(i);
        }



        var output = [];

        for(var i = 0;i< count;i++){
            var total_count = list.length;
            var idx = Math.floor(Math.random()*total_count);
            list.splice(idx,1);

            var id = data[list[idx]];

            output.push([list[idx],generateVideoUrl(key,id),gennertateTimgUrl(id)])
        }

       // return callback(null,msg('news',output))
        return callback(null,output);

    });


}

function generateVideoUrl(key,id){
    return "http://m.yunfan.com/#/"+key+"/"+id;
}

function gennertateTimgUrl(id){
    return 'http://img.yunfan.com/index.php?t=m&mid=middle_'+id;
}



module.exports = {
    search:search,
    getNew:getNew,
    getHot:getHot,
    getQvodADMovie:getQvodADMovie,
    type:{
        dy:{key:'mo',api:DIANYING},
        tv:{key:'tv',api:DIANSHIJU},
        dm:{key:'ct',api:DONGMAN},
        zy:{key:'va',api:ZONGYI}
    },
    getRandom:getRandom
}