/**
 * Date: 14-1-4
 * Time: 下午3:59
 */
var utils = require('./utils');
var pt = require('./Platform');
var movie = require('./qvod/service/movie');
var act = require('./qvod/act/')


function create(){

    var menu =  {
        "button":[
            {
                "name":"用户互动",
                "sub_button":[
                    {
                        "type":"click",
                        "name":"客户服务",
                        "key":"Q&A"
                    },
                    {
                        "type":"click",
                        "name":"用户抽奖",
                        "key":"LOTTERY"
                    },
                    {
                        "type":"click",
                        "name":"最新活动",
                        "key":"ACT"
                    }]
            },
            {

                "name":"云帆搜索",
                "sub_button":[
                    {
                        "type":"click",
                        "name":"快播视频",
                        "key":"QVOD_VIDEO"
                    },
                    {
                        "type":"click",
                        "name":"热门推荐",
                        "key":"HOT_MOVIE"
                    },
                    {
                        "type":"click",
                        "name":"新片推荐",
                        "key":"NEW_MOVIE"
                    },
                    {
                        "type":"click",
                        "name":"影片搜索",
                        "key":"SEARCH_MOVIE"
                    }]
            },
            {
                "name":"移动快播",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"下载",
                        "url":"http://m.kuaibo.com/"
                    },
                    {
                        "type":"click",
                        "name":"推推找片",
                        "key":"TUITUI"
                    },
                    {
                        "type":"click",
                        "name":"快播雷达",
                        "key":"RADAR"
                    }]

            }]
    };


    utils.HttpsPost('https://api.weixin.qq.com/cgi-bin/menu/create?access_token='+pt.access_token,JSON.stringify(menu),function(err,data){
        console.log(err,JSON.parse(data.body.toString()))
    });
}

function listen(info,next){
    //console.log('menu============',info.param,next)
            switch(info.param.eventKey){
                case 'Q&A':
                    return next('请直接回复您的问题，我们的客服人员会为您解答！');
                    break;
                case 'LOTTERY':
                    return act.getList(info.uid,next);
                    break;
                case 'ACT':
                    return next('暂时没有活动！');
                    break;
                case 'QVOD_MOVIE':
                    return movie.getQvodADMovie(next);
                    break;
                case 'HOT_MOVIE':
                    return movie.getHot(next);
                    break;
                case 'NEW_MOVIE':
                    return movie.getNew(next);
                    break;
                case 'SEARCH_MOVIE':
                    return next('请直接发送“s影片名”或者“s演员名”即可搜索相关影片，比如“s成龙”。<a href="http://m.yunfan.com">点击这里进入搜索主页</a>');
                    break;
                case 'TUITUI':
                    break;
                case 'RADAR':
                    return next('您可以点击“+”，然后选择“位置”发送您的所在地，就可以查找附近的网友在看什么影片了！');
                    break;

    }
}



module.exports = {
    create:create,
    listen:listen

}
