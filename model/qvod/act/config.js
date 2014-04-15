/**
 * Date: 13-12-10
 * Time: 下午5:02
 */

/*活动html页面*/
var lottery_page;
var lottery_cover;
var LOCAL_LOTTERY_PAGE = 'http://localhost:3000/kuaibo/act/lottery/';
var QVOD_LOTTERY_PAGE = 'http://wechat.kuaibo.com/kuaibo/act/lottery/';
var LOCAL_LOTTERY_COVER = 'http://localhost:3000/kuaibo/act/lottery/files/cover.jpg';
var QVOD_LOTTERY_COVER = 'http://wechat.kuaibo.com/kuaibo/act/lottery/files/cover.jpg';

var guagua_page;
var guagua_cover;
var LOCAL_GUAGUA_PAGE = 'http://localhost:3000/kuaibo/act/guagua/';
var QVOD_GUAGUA_PAGE = 'http://wechat.kuaibo.com/kuaibo/act/guagua/';
var LOCAL_GUAGUA_COVER = 'http://localhost:3000/kuaibo/act/guagua/files/cover.jpg';
var QVOD_GUAGUA_COVER = 'http://wechat.kuaibo.com/kuaibo/act/guagua/files/cover.jpg';

var db_options ;
var LOCAL_DB_OPTIONS = {
        'host':'localhost',
        'port':3306,
        'user':'root',
        'password':'',
        'database':'wechat_kuaibo_com'

    };
var QVOD_DB_OPTIONS = {
        'host':'172.16.22.26',
        'port':3306,
        'user':'wechat',
        'password':'fnrm3IMV920vZ5wP6eUrGsMSerI1g3',
        'database':'wechat_kuaibo_com'

    };


exports.init = function(env){
    console.log('=== act config : '+env+' ===')

    if(env == 'dev'){
        this.lottery_page = LOCAL_LOTTERY_PAGE;
        this.lottery_cover = LOCAL_LOTTERY_COVER;
        this.guagua_page = LOCAL_GUAGUA_PAGE;
        this.guagua_cover = LOCAL_GUAGUA_COVER;
        this.db_options = LOCAL_DB_OPTIONS;
    }else if(env == 'pro'){
        this.lottery_page = QVOD_LOTTERY_PAGE;
        this.lottery_cover = QVOD_LOTTERY_COVER;
        this.guagua_page = QVOD_GUAGUA_PAGE;
        this.guagua_cover = QVOD_GUAGUA_COVER;
        this.db_options = QVOD_DB_OPTIONS;
    }

}

exports.lottery_page = lottery_page;
exports.lottery_cover = lottery_cover;
exports.guagua_page = guagua_page;
exports.guagua_cover = guagua_cover;
exports.db_options = db_options;


