/**
 * Date: 14-1-4
 * Time: 下午2:25
 *
 * 1、appid + secret > access_token
 * 2、access_token > create menu
 */

var GRANT_TYPE = 'client_credential';
//var APPID = 'wx927bc10d2b6e5c59';
//var SECRET = '9a7fca9718e7f9bc761a023c184d22ab';
var OPENID = 'o5cktt6kRv8l3rlk3SZJHqzlAul8';

var APPID = 'wx87ee8bb752d21d24';
var SECRET = '32fcec2ede2da7f81945fc23dafdf1d0';



var utils = require('./utils');
var act = require('./qvod/act/');
var Menu = require('./Menu');
var CronJob = require('cron').CronJob;
var saotu = require('./qvod/service/saotu');

var access_token = '';
var root = this;

function init(app,webot){

    console.log('=== PLATFORM INIT === ');

    addRule(webot);

    act.init();



    //getAccessToken();
    //access_token是公众号的全局唯一票据，公众号调用各接口时都需使用access_token。正常情况下access_token有效期为7200秒，重复获取将导致上次获取的access_token失效。
    // new CronJob('0 */30 */1 * * *',function(){ //每隔1小时30分钟
    //    getAccessToken();
    //},null,true,'');


}

function getAccessToken(callback){
    utils.HttpsGet('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+APPID+'&secret='+SECRET,function(err,data){
        console.log(err,JSON.parse(data.body.toString()));
        var data = JSON.parse(data.body.toString())
        this.access_token =  data.access_token;


        exports.access_token = this.access_token;
        //Menu.create();

        if(callback) callback(this.access_token);

    });
}


function addRule(webot){


    var reg_help = /^(help|\?)$/i
    webot.set({

        name: 'hello help',
        description: '获取使用帮助，发送 help',
        pattern: function(info) {
            return info.is('event') && info.param.event === 'subscribe' || reg_help.test(info.text);
        },
        handler: function(info){

            return '欢迎关注快播科技！';
        }
    });


    var msg = require('../support').customMsg;
    webot.set('test',{
        description: '发送电影名/演员名',
        pattern:/test/i,
        handler: function(info){
            return msg('news',[[info.sp,'http://wemade.duapp.com/html/','http://baidu.com','test']]);
        }
    })



    function do_saotu(info,next){
        return saotu(info.param.picUrl,next);
    }

    webot.set('saotu',{
        description:'发送图片',
        pattern:function(info){
            return info.is('image');
        },
        handler:do_saotu
//        handler:function(info){
//           return info.param.picUrl;
//        }

    })



    var movie = require('./qvod/service/movie');
    function do_soupian(info,next){
        console.log(info.param)

         return movie.search(info.param['1'],next);
    }

    webot.set('soupian',{
        description: '发送电影名/演员名',
        pattern:/^s\s*(.+)/i,
        handler: do_soupian
//        handler:function(){
//            return msg('news',[['毒战','','http://www.baidu.com'],['毒战','','http://www.baidu.com'],['毒战','','http://www.baidu.com']])
//        }
    })


    var radar = require('./qvod/service/radar');
    function do_radar(info,next){
        console.log(info.param,info.param.lat);
        return radar(info.param,next);
    }

    webot.set('radar',{
        description:'发送经纬度找片',
        pattern:function(info) {
            return info.is('location');
        },
        handler:do_radar
    })


    function do_menu(info,next){

        Menu.listen(info,next);
    }

    webot.set({
        // name 和 description 都不是必须的
        name: 'menu',
        pattern: function (info) {
            //首次关注时,会收到subscribe event
            return info.is('event') && info.param.event === 'CLICK';
        },
        handler: do_menu
    });


    //所有消息都无法匹配时的fallback
    webot.set(/.*/, function(info){
        // 利用 error log 收集听不懂的消息，以利于接下来完善规则
        // 你也可以将这些 message 存入数据库
        console.log('unhandled message: %s', info.text);
        info.flag = true;
        return '你发送了「' + info.text + '」,可惜我太笨了,听不懂. 发送: help 查看可用的指令';
    });
}



function getUserInfo(openid,callback){
    console.log(pt.access_token,pt)

    utils.HttpsGet('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+pt.access_token+'&openid='+openid,function(err,data){
        if(data){
            var obj = JSON.parse(data.body.toString());

            var user = {openid:obj.openid,nickname:obj.nickname,sex:obj.sex,headimgurl:obj.headimgurl,province:obj.province,city:obj.city};


            console.log('user===',user);
            callback(user);
        }
    });

}



exports.init = init;

