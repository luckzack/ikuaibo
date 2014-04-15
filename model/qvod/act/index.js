/**
 * Date: 13-12-6
 * Time: 下午4:35
 */

var msg = require('../../../support').customMsg;
var cfg = require('./config');
var md5 = require('../../../support').md5;
var cards = [['猪仔卡',"card_pig.png",'再试一次'],['狗仔卡',"card_dog.jpg",'谢谢捧场'],['鸡仔卡',"card_chicken.png",'欢迎再来'],['猴仔卡',"card_monkey.png",'就差一点'],['熊猫卡',"card_panda.png",'大奖在望'],['浣熊卡',"card_raccoon.jpg",'再给力点']]
var user = require('./user');



var ready = function(req,res){

    var act = req.body.act;
    var ua = req.headers['user-agent'];
    var openid = req.body.openid;
    var ts = req.body.ts;

    var result = checkAuth(ua,openid,ts);
    if( result != 800){
        res.end(JSON.stringify({ok:false,code:result}));
    }else{
        res.end(JSON.stringify({ok:true}));
    }

}





/**
 * 抽奖请求：
 * 1、检查UA
 * 2、检查openid是否符合规范  eg:o5cktt6kRv8l3rlk3SZJHqzlAul8
 * 3、检查时间戳ts是否在5分钟内
 * 4、检查数据库中用户是否已抽奖
 * 5、确认可以抽奖，生成抽奖结果后把数据保存到数据库
 */
var lottery = function(req,res){
    console.log('lottery====',req.query);
    addResHeader(res);



    var ua = req.headers['user-agent'];
    var openid = req.query.openid;
    var ts = req.query.ts;


    var result = checkAuth(ua,openid,ts);
    if( result != 800){
        res.end(JSON.stringify({ok:false,code:result}));
    }else{


        checkLotterid(openid,function(isLotterid,result){
            if(isLotterid){
                return res.end(JSON.stringify({ok:false,code:804,data:{prizetype:result[0].prize_type,sn:result[0].prize_sn}}));
            }else{

                var prize_type = Math.ceil(Math.random()*3);
                var prize_sn;
                console.log('>>>生成抽奖结果：',openid,prize_type,new Date())


                if(prize_type > 3){
                    prize_type = 0;
                }else{
                    prize_sn = md5(req.query.openid+new Date().getTime());
                }

                res.end(JSON.stringify({ok:true,data:{prizetype:prize_type,sn:prize_sn}}))


                user.insert('lottery',[{openid:req.query.openid,prize_type:prize_type,prize_sn:prize_sn}]);


            }
        })

    }


};

var setTel = function(req,res){
    //console.log(req.body);
    addResHeader(res);
    res.end(JSON.stringify({ok:true}));



    user.update('lottery',{openid:req.body.openid,tel:req.body.tel});

};

var guagua = function(req,res){
    console.log('guagua===',req.query);
    var r = Math.floor(Math.random()*6);

    addResHeader(res);
    res.end(JSON.stringify({"result":cards[r][2],"tips":"继续努力吧！","cardName":cards[r][0],"cardURL":cards[r][1]}));
}


//////////////////////////////// PUBLIC METHODS ////////////////////////////////////////////////////////


exports.init = function(){
    console.log('=== ACT INIT ===')
    user.init();

    //可以从xml中加载配置列表
}


/**
 * 活动相关的路由
 * @param req
 * @param res
 * @param next
 */
exports.handle =  function(req,res,next){
    var q = req.query.q;
    console.log('!!! act ===',req.path,req.params,req.query,q)

    switch(q){
        case 'ready':
            ready(req,res);
            break;
        case 'lottery':
            lottery(req,res);
            break;
        case 'guagua':
            guagua(req,res);
            break;
        case 'setTel':
            setTel(req,res);
            break;

        default:
            next();
            break;

    }

};

/**
 * 获取活动列表,根据用户openid判断是否参加过活动，如果有就在图文列表中加个提示，而且可以参加活动，但是中奖率为0
 * @param callback
 */
exports.getList = function(openid,callback){

    checkLotterid(openid,function(isLotterid){
        if(isLotterid){
            //已参加过就不用传openid了，反正也中不了
            return callback(null,msg('news',[['尊敬的用户，您已参与过抽奖！'],['萌宠刮刮卡',cfg.guagua_page,cfg.guagua_cover],['快乐大抽奖',cfg.lottery_page,cfg.lottery_cover]]));

        }else{
            return callback(null,msg('news',[['萌宠刮刮卡',cfg.guagua_page+'?'+openid,cfg.guagua_cover],['快乐大抽奖',cfg.lottery_page+'?'+openid,cfg.lottery_cover]]));

        }
    })

}

////////////////////////////////// PRIVATE METHODS ////////////////////////////////////////////////////

var addResHeader = function(res){
    //res.header("Access-Control-Allow-Origin","*");
}


var checkAuth = function(ua,openid,ts){
    console.log('checkAuth====',ua,openid,ts);


    if(checkUA(ua)){
        if(openid.length != 28) return 802;

        var now = String(new Date().getTime()).slice(-6,-1);
        if(Math.abs(ts-now) > 5*60*100 ) return 803;

        return 800;

    }else{
        return 801;
    }

}

/**
 * req.headers['user-agent']
 *
 * iphone: Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3
 * ipad: Mozilla/5.0 (iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3
 * android: Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19
 * android + wechat: Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36 MicroMessenger/5.2.380
 */
function checkUA(ua){
    var reg = ua.match(/MicroMessenger/);
    if(reg && reg.length>0) return true;
    else return false;
}

function checkLotterid(openid,callback){
    user.query('lottery',openid,function(err,result){

        if(!err && result && result.length < 1){
            callback(false);
        }else{
            callback(true,result);
        }
    });
}



/*
 订阅号不能直接取到用户的信息，只能通过用户线发消息的形式拿到sp。服务号可以？
 用户回复“抽奖”，server拿到一个sp，根据sp返回响应的抽奖地址(http://../act/lottery?u=sp)
 当用户请求该地址，发起抽奖请求的时候，带上参数sp,server根据sp查询该用户的抽奖权限
 */

