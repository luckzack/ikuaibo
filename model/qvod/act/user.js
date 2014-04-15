/**
 * 活动用户的信息查询、保存，连接数据库与活动api
 * Date: 2014/3/28
 * Time: 17:49
 */


var sql = require('../../sql');
var _ = require('underscore');

module.exports = {
    init:init,
    query:query,
    insert:insert,
    update:update
}

function init(){
    sql.check('lottery');
}

/**
 *
 * @param act
 * @param user
 * @param callback
 */
function query(act,openid,callback){
    var key = 'openid';
    var value = openid;
    sql.queryData(act,key,value,callback);

}

/**
 * 判断是什么act,act即是table名
 * @param act  {String} 'lottery'
 * @param users {Array} [{openid:String,prize_type:int,prize_sn:String,tel:String},{},{}]
 * @param callback
 */
function insert(act,users,callback) {

    if (users && users.length > 0) {



        var values = '';

        //_.each([{user: 'u1',prize_type:0,prize_sn:''},{user: 'u2',prize_type:0,prize_sn:''},{user: 'u3',prize_type:0,prize_sn:''}], function(item){
        _.each(users, function (item) {
            values += '("' + item['openid'] + '",' + item['prize_type'] + ',"' + item['prize_sn'] + '","' + item['tel'] + '"),';

        });
        values = values.slice(0, -1);
        //console.log(values);


        var key;

        if(act == 'lottery'){
            key = '(openid,prize_type,prize_sn,tel)';

            sql.insertData(act,key,values,callback);
        }


    }
}

/**
 *
 * @param act
 * @param user {openid:String,prize_type:int,prize_sn:String,tel:String}
 * @param callback
 */
function update(act,user,callback){


    if(user && user.openid){
        var key = 'openid';
        var value = user.openid;
        var set = 'tel="'+user.tel+'"';

        sql.updateData(act,key,value,set,callback);
    }

}


