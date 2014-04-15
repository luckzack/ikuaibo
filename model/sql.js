/**
 * 数据库基本操作，不涉及业务逻辑
 * @type {exports}
 */


var config = require('./qvod/act/config');
var _ = require('underscore');

var mysql = new require('mysql'),
    db = null,
    db_options,
    db_name;


//先检查你的数据库有没有创建
function check($table_name){
    db_options = config.db_options;
    db_name = config.db_options.database;



    if(mysql.createClient) {
        db = mysql.createClient(db_options);
        console.log('connect db :' +JSON.stringify(db_options));

        useDB(db_name,function(err,result){

            if(err){
                createDB(db_name,function(err,result){
                    if(!err && result){

                        checkTable($table_name);
                    }
                });
            }else{

                checkTable($table_name);
            }


        });

    } else {
        db = new mysql.Client(db_options);
        db.connect(function(err) {
            if(err) {
                console.error('connect db ' + db.host + ' error: ' + err);
                process.exit();
            }else{
                console.log('connect db ' + db.host);
            }
        });
    }

}



function checkTable($table_name){



            showTable($table_name,function(err,result){
                if(err || !result[0]){
                    createTable($table_name)
                }else{
                    db.end();
                }

            })



}




//每次查询要先连接，查询完就要关闭数据库连接
function connectDb(callback){

    db = mysql.createClient(db_options);
    useDB(db_name,callback);

}

function useDB($db_name,callback){
    db.query('USE '+$db_name,function(err,result){
       if(err){
           console.error('[STATE] use db err');

       }else{
           console.log('[STATE] use db succ');

       }
       if(callback) callback(err,result);
    });
}

function createDB($db_name,callback){


            db.query('CREATE DATABASE '+$db_name,function(err,result){
                if(err){
                    console.error('[STATE] create db err',db_name,err);

                }else{
                    console.log('[STATE] create db succ');

                }
                if(callback) callback(err,result);
            });




}

function showTable($table_name,callback){
            db.query('SHOW TABLES LIKE "'+$table_name+'"',function(err,result){

                if(err || result.length < 1){

                    console.error('[STATE] table not exist');
                }else{
                    console.log('[STATE] table  exist');
                }
                if(callback) callback(err,result);
            });




}


function createTable($table_name,callback) {

    db.query('CREATE TABLE '+ $table_name +
            '(id INT(11) AUTO_INCREMENT, '+
            'openid VARCHAR(255), '+
            'prize_type TINYINT, '+
            'prize_sn VARCHAR(255),'+
            'tel VARCHAR(11),'+
            'PRIMARY KEY (id));', function(err, result) {
            if (err && err.number != db.ERROR_TABLE_EXISTS_ERROR) {
                console.error('[STATE] create table error:'+err);



            }else{
                console.log("[STATE] create table success");

                db.end();
            }
            if(callback) callback(err,result);

        });
}


/**
 * 插入数据
 * @param table_name
 * @param key
 * @param values
 * @param callback
 */
function insertData($table_name,key,values,callback){
    if($table_name && key && values){
        connectDb(function(err,result){
            if(!err && result){
                db.query('INSERT INTO '+$table_name+' '+key+ ' VALUES '+values,function(err,result){
                    if(err){
                        console.error('[STATE] insert data err:'+err)
                    }else{
                        console.log('[STATE] insert data succ');
                    }
                    if(callback) callback(err,result);
                })
            }
        })



    }else{
        console.error('invalid data to insert');
    }
}




/**
 * 查询数据
 * @param table_name
 * @param key
 * @param value
 * @param callback
 */
function queryData($table_name,key,value,callback){
    //console.log('sql queryData===',arguments,db)


    connectDb(function(err,result){
        if(!err && result){
            db.query(
                    'SELECT * FROM '+$table_name + ' WHERE '+key+'="'+value+'"',
                function (err, result, fields) {
                    if (err) {
                        console.error('[STATE] query error:'+err);


                    }else{
                        console.log('[STATE] query success:',result);


                        db.end();

                    }

                    if(callback) callback(err,result);
                });


        }
    })


}

/**
 *
 * @param $table_name
 * @param key
 * @param value
 * @param set 要更新的内容
 * @param callback
 */
function updateData($table_name,key,value,set,callback){
    connectDb(function(err,result){
        if(!err && result){
            //db.query('UPDATE '+$table_name + ' SET prize_type = '+prize_type+', prize_sn = "'+prize_sn+'" WHERE openid="'+openid+'"',
            db.query('UPDATE '+$table_name + ' SET ' + set +  ' WHERE '+key+'="'+value+'"',
                // db.query('UPDATE 2013_12_10 SET  prize_type = 0, prize_sn = "" WHERE user="webot"',
                function(err,result){
                    if(err){
                        console.log('[STATE] updateData err:'+err);

                    }else{
                        console.log('updateData succ:');

                        db.end();
                    }
                    if(callback) callback(err,result);
                });
        }
    })

}


exports.check = check;
exports.queryData = queryData;
exports.insertData = insertData;
exports.updateData = updateData;




function deleteDB(){
    db.query('DROP DATABASE wemade_duapp_com',function(err,result){
        console.log(err,result)
    })
}

function deleteRow(user){
    db.query('DELETE FROM '+table_name+' WHERE user="'+user+'"',function(err,result){
       if(err){
           console.error('[STATE] delete row err');
       }else{
           console.log('[STATE] delete row suc');
       }
    });
}


