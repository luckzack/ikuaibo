/**
 * Date: 2014/3/27
 * Time: 16:31
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


module.exports = {
    search:search,
    getNew:getNew,
    getHot:getHot,
    getQvodADMovie:getQvodADMovie
}



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




