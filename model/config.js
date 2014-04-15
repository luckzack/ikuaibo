/**
 * Date: 14-1-13
 * Time: 下午3:40
 */



var HOST = 'wechat.kuaibo.com';
var PATH = '/kuaibo';
var URL = 'http://'+HOST+PATH;
var PORT = 3601;

var act_cfg = require('./qvod/act/config');

var init = function(env){
    console.log('=== config : '+env+' ===')

    act_cfg.init(env);

}



module.exports = {
    init:init,
    HOST:HOST,
    PATH:PATH,
    URL:URL,
    PORT:PORT
}
