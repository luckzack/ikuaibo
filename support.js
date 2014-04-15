var debug = require('debug');
var log = debug('webot-example:log');

//var _ = require('underscore')._;
var request = require('request');

/**
 * 通过高德地图API查询用户的位置信息
 */
exports.geo2loc = function geo2loc(param, cb){
  var options = {
    url: 'http://restapi.amap.com/rgeocode/simple',
    qs: {
      resType: 'json',
      encode: 'utf-8',
      range: 3000,
      roadnum: 0,
      crossnum: 0,
      poinum: 0,
      retvalue: 1,
      sid: 7001,
      region: [param.lng, param.lat].join(',')
    }
  };
  log('querying amap for: [%s]', options.qs.region);

  //查询
  request.get(options, function(err, res, body){
    if(err){
      error('geo2loc failed', err);
      return cb(err);
    }
    var data = JSON.parse(body);
    if(data.list && data.list.length>=1){
      data = data.list[0];
      var location = data.city.name || data.province.name;
      log('location is %s, %j', location, data);
      return cb(null, location, data);
    }
    log('geo2loc found nth.');
    return cb('geo2loc found nth.');
  });
};

/**
 * 搜索百度
 *
 * @param  {String}   keyword 关键词
 * @param  {Function} cb            回调函数
 * @param  {Error}    cb.err        错误信息
 * @param  {String}   cb.result     查询结果
 */
exports.search = function(keyword, cb){
  log('searching: %s', keyword);
  var options = {
    url: 'http://www.baidu.com/s',
    qs: {
      wd: keyword
    }
  };
  request.get(options, function(err, res, body){
    if (err || !body){
      return cb(null, '现在暂时无法搜索，待会儿再来好吗？');
    }
    var regex = /<h3 class="t">\s*(<a.*?>.*?<\/a>).*?<\/h3>/gi;
    var links = [];
    var i = 1;

    while (true) {
      var m = regex.exec(body);
      if (!m || i > 5) break;
      links.push(i + '. ' + m[1]);
      i++;
    }

    var result;
    if (links.length) {
       result = '在百度搜索:' + keyword +',得到以下结果：\n' + links.join('\n');
       result = result.replace(/\s*data-click=".*?"/gi,  '');
       result = result.replace(/\s*onclick=".*?"/gi,  '');
       result = result.replace(/\s*target=".*?"/gi,  '');
       result = result.replace(/<em>(.*?)<\/em>/gi,  '$1');
       result = result.replace(/<font.*?>(.*?)<\/font>/gi,  '$1');
       result = result.replace(/<span.*?>(.*?)<\/span>/gi,  '$1');
    } else {
      result = '搜不到任何结果呢';
    }

    // result 会直接作为
    // robot.reply() 的返回值
    //
    // 如果返回的是一个数组：
    // result = [{
    //   pic: 'http://img.xxx....',
    //   url: 'http://....',
    //   title: '这个搜索结果是这样的',
    //   description: '哈哈哈哈哈....'
    // }];
    //
    // 则会生成图文列表
    return cb(null, result);
  });
};

/**
 * 下载图片
 *
 * 注意:只是简陋的实现,不负责检测下载是否正确,实际应用还需要检查statusCode.
 * @param  {String} url  目标网址
 * @param  {String} path 保存路径
 */
exports.download = function(url, stream){
  log('downloading %s a stream', url);
  return request(url).pipe(stream);
};

/**
 * 点歌
 * @param {int} mode 模式：0——随机热门，1——歌名（歌手）点歌，2——心情点歌
 * @param {String} pattern: 歌名+空格+歌手/心情
 * eg.    http://box.zhangmen.baidu.com/x?op=12&count=1&title=大约在冬季$$齐秦$$$$
 */
var xmlreader = require("xmlreader");
exports.pickSong = function(mode,pattern,cb){
    pattern+=' tank'
    console.log('====',mode,pattern)

    var API = 'http://box.zhangmen.baidu.com/x?op=12&count=1&title=';
    var song,songer,songurl;
    if(mode == 1){
       if(pattern.indexOf(' ')> -1){
           var ary = pattern.split(' ');
           song = ary[0];
           songer = ary[1];
           API += song+'$$'+songer+'$$$$';
       }else{
           song = pattern;
           API += song+'$$';
       }
    }else if(mode == 2){

    }else{

    }

    console.log(API)
    request(API,function(err,res,body){

        if(!err && res.statusCode ==200 ){
            xmlreader.read(body, function(err, res){
                if(null !== err ){
                    console.log(err)
                    return;
                }
                if(res.result.url){
                    if(res.result.url.array){
                        songurl =  res.result.url.array[0].encode.text()+res.result.url.array[0].decode.text();
                    }else{
                        songurl =  res.result.url.encode.text()+res.result.url.decode.text();
                    }
                  return cb(null,customMsg('music',[song,songer,songurl,songurl]))
                    return cb(null,customMsg('music',['爸爸在哪儿?','年度最感人歌曲。歌曲较大，建议用wifi转到网页播放。','http://843sev.duapp.com/dad.mp3','http://843sev.duapp.com/dad.mp3']))
                   // return cb(null,customMsg('music',[song,'http://yinyueshiting.baidu.com/data2/music/36204458/12946643126000128.mp3?xcode=a4db7e6973420b3c586e08bce85ff48cf8a04f56ad55fd6d',songer?('by '+songer):'']));

                }else{
                    console.log('Sorry,找不到你要的歌');
                    return cb(null,'Sorry,找不到你要的歌');
                }

            });

        }

    });


}
exports.customMsg = customMsg;

/**
 *
 * @param type {String} 直接回复文本消息，不能超过2048字节
 * @param value {Object} 单条 图文消息/音乐消息 {Array} 多条图文消息
 * @returns {*}
 */
 function customMsg(type,value){

    var msg;
    switch(type){
        case 'text':
            msg = value;
            break;
        case 'music':
            msg = {type:'music',
                title:value[0],
                description:value[1],
                musicUrl:value[2],
                hqMusicUrl:value[3],
                ThumbMediaId:10001155};
            break;
        case 'pic':
            msg = {title:value[0],
                url:value[1],
                picUrl:value[2],
                description:value[3]};
            break;
        case 'news':
            msg = [];
            for(var i = 0;i < value.length;i++){
                msg.push({title:value[i][0],
                    url:value[i][1],
                    picUrl:value[i][2],
                    description:value[i][3]});
            }

            break;
        case 'media':

            break;
        case 'date_query':
            var month = (value.split('.'))[0];
            var day = (value.split('.'))[1];

            if(month < 1 || month > 12 || day <1 || day > 31){
                msg = '您回复的日期不符合规则，请重新输入';
            }else if(month == 2 && day > 28){
                msg = '您回复的日期不符合规则，请重新输入';
            }else if((month == 4 || month == 6 || month == 9 || month == 11) && day > 30){
                msg = '您回复的日期不符合规则，请重新输入';
            }else{
                var anyday=new Date(2013,month-1,day);var week;
                if(anyday.getDay()==0)week="星期日"
                else if(anyday.getDay()==1)week="星期一"
                else if(anyday.getDay()==2)week="星期二"
                else if(anyday.getDay()==3)week="星期三"
                else if(anyday.getDay()==4)week="星期四"
                else if(anyday.getDay()==5)week="星期五"
                else if(anyday.getDay()==6)week="星期六"

                msg = '2013年'+month+'月'+day+'日，'+week+'，天气小雨，PM2.5，适合居家看电影。\n'+
                    '今日上映：\n'+
                    'd1:《金刚狼2》\n'+
                    'd2:《蓝精灵》\n'+
                    'd3:《精忠报国》\n'+
                    'd4:《碧血剑》\n'+
                    'd5:《德玛西亚历险记》\n'+
                    '回复相应序号，可获取对应资源链接，比如d1。';
            }

            break;
        case 'default':
            msg = '小Q虽然不明白你在说什么，但是感觉挺厉害的样子。\n' +
                '请回复1 —— 快播动态，\n3 —— 最新影讯，\n4 —— 网友珍藏,\n5 —— 流量矿石行情,\n6 —— 花色集,\n7 —— 快播广场,\n8 —— 每日一歌\n' +
                '您也可以发送："影片名" —— 影片资源，\n"地理位置" —— 附近区域的电影资源，\n"月份.日期" —— 查询当天上映电影。\n' +
                '绑定快播后，您将获得更多特权，了解请回复0。\n'+
                '请不要回复2。\n'+
                '快播，你懂的！';
            break;

    }
    console.log(type,value)
    return msg;
}

var crypto = require('crypto');

exports.encrypt = function (str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

exports.decrypt = function (str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.md5 = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};

exports.randomString = function (size) {
    size = size || 6;
    var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var max_num = code_string.length + 1;
    var new_pass = '';
    while (size > 0) {
        new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
        size--;
    }
    return new_pass;
};