var express = require('express');
var webot = require('weixin-robot');
var rule = require('./rules/index');
var http = require('http');
var path = require('path');
var cfg = require('./model/config');

var app = express();


app.set('views', __dirname + '/view');
app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(express.session({ secret: 'abced111', store: new express.session.MemoryStore() }));
app.use(express.static(path.join(__dirname, 'public')));
process.env.PORT ? app.set('env','dev'):app.set('env','pro');

console.log('=== READ ENV PORT:',process.env.PORT)

var router = require('./controller/router');
router.init(app);


var webot2 = new webot.Webot();
webot2.watch(app, {
    token: 'lve',
    path: '/'
});


// 在环境变量提供的 本地测试端口 或 服务器端口监听
var port = process.env.PORT || cfg.PORT;

//rule(webot2);



var pt = require('./model/Platform');
pt.init(app,webot2);


app.listen(port);

console.log('app start in',port)


/////////////////////test

var movie = require('./model/qvod/service/movie');

movie.getRandom(movie.type.dy,4,function(err,data){

})









