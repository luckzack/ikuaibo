/**
 * Date: 14-1-5
 * Time: 下午2:23
 *
 *  ROUTER:
 *  1、act服务
 *
 */

var cfg = require('./../model/config');
var act = require('../model/qvod/act/');



function init(app){


    cfg.init(app.get('env'));
    console.log('=== ROUTER INIT ===',cfg.PATH+'/act/')

    //活动请求
    app.use(cfg.PATH+'/act/',act.handle,function(req,res){
        res.end('403');

    });




};

exports.init = init;
