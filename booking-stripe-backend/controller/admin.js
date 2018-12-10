const async = require('async');
const connection = require('../config/index').CONFIG.connection;
const Lib = require('../Lib/index');
const stripeKeys = 'sk_test_dKqLvGo1lkA7sDaRfWUP7gHq';
const stripeKeysA = 'pk_test_6LeCiWCnfnx8mIFqEmEzQUb2';
const stripe = require('stripe')(stripeKeys);
const stripeA = require('stripe')(stripeKeysA);
const request = require('request');

var add_admin = function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let encrypt_password;
    async.auto({
        get_admin: function(cb){
            var sql = 'SELECT * FROM `tb_admin` WHERE `username` = ?';
            var params = [username];
            connection.query(sql, params, function(err, resp){
                if(err){
                    cb(err);
                }
                else if(resp.length){
                    let finalResult = {
                        "statusCode" : 201,
                        "message" : 'ADMIN ALREDAY ADDED',
                        "data" : {}
                    }
                    res.send(finalResult);
                }
                else{
                    Lib.UNIVERSAL_FUNCTION.bcryptPassword(password, function(err, resp){
                        if(err){
                            cb(err)
                        }
                        else{
                            encrypt_password = resp;
                            cb();
                        }
                    });
                }
            });
        },
        insert_admin : ['get_admin', function(err, cb){
            let sql = 'INSERT INTO `tb_admin` (`username`,`password`,`name`) VALUES (?,?,?)';
            let params = [username,encrypt_password,name];
            connection.query(sql, params, function(err1, resp){
                if(err1){
                    cb(err1)
                }
                else{
                    cb(null, 'Admin added Successfully..!');
                }
            })
        }]
    },function(error, result){
        if(error){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else{
            let finalResult = {
                "statusCode" : 200,
                "message" : 'Success',
                "data" : result || {}
            }
            res.send(finalResult);
        }
    });
};

var admin_login = function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    let access_token , previous_password;
    async.auto({
        get_admin: function(cb){
            var sql = 'SELECT * FROM `tb_admin` WHERE `username` = ?';
            var params = [username];
            connection.query(sql, params, function(err, resp){
                if(err) {
                    cb(err);
                }
                else{
                    if(resp.length){
                        previous_password = resp[0].password;
                        cb();
                    }
                    else{
                        let finalResult = {
                            "statusCode" : 201,
                            "message" : 'ADMIN IS NOT ADDED',
                            "data" : {}
                        }
                        res.send(finalResult);
                    }
                }
            });
        },
        compare_password : ['get_admin',  function(err, cb){
            Lib.UNIVERSAL_FUNCTION.comparePassword(password,previous_password, function(err, resp){
                if(err){
                    cb(err);
                }
                else if(resp){
                    access_token = Lib.TOKEN_MANAGER.createToken(username);
                    cb();
                }
                else{
                    let finalResult = {
                        "statusCode" : 201,
                        "message" : 'Incorrect Password',
                        "data" : {}
                    }
                    res.send(finalResult);
                }
            });
        }],
        login_admin: ['get_admin', 'compare_password' ,function(err, cb){
            var sql = 'UPDATE `tb_admin` SET `access_token` = ? WHERE `username` = ?';
            var params = [access_token, username];
            connection.query(sql, params, function(err, resp){
                if(err) {
                    cb(err)
                }
                else{
                    cb(null, access_token);
                }
            });
        }]
    }, function(error, result){
        if(error){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else{
            let finalResult = {
                "statusCode" : 200,
                "message" : 'Success',
                "data" : result || {}
            }
            res.send(finalResult);
        }
    });
};

var admin_logout = function(req, res){
    var access_token = req.headers.access_token;
    let username;
    async.auto({
        get_admin : function(cb){
            let sql = 'SELECT * FROM `tb_admin` WHERE `access_token` = ?';
            let params = [access_token];
            connection.query(sql, params, function(err, resp){
                if(err) cb(err);
                else{
                    if(resp.length){
                        username = resp[0].username;
                        cb();
                    }
                    else{
                        let finalResult = {
                            "statusCode" : 201,
                            "message" : 'ADMIN IS NOT EXITS',
                            "data" : {}
                        }
                        res.send(finalResult);
                    }
                }
            });
        },
        logout_admin: ['get_admin', function(err, cb){
            let sql = 'UPDATE `tb_admin` SET `access_token` = null WHERE `username` = ?';
            let params = [username];
            connection.query(sql, params, function(err1, resp){
                if(err1){
                    cb(err1);
                }
                else
                {
                    cb(null, 'Admin Logout Successfully');
                }
            });
        }]
    }, function(error, result){
        if(error){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else{
            let finalResult = {
                "statusCode" : 200,
                "message" : 'Success',
                "data" : result || {}
            }
            res.send(finalResult);
        }
    });
};

var get_all_bookings = function(req, res){
    let sql = 'SELECT * FROM `tb_bookings`';
    connection.query(sql, function(err, resp){
        if(err){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else{
            let finalResult = {
                "statusCode" : 200,
                "message" : 'Success',
                "data" : resp || {}
            }
            res.send(finalResult);
        }
    });
};

var add_shops = function(req, res){
    let shop_name = req.body.shop_name;
    let shop_author = req.body.shop_author;
    let shop_address = req.body.shop_address;
    async.auto({
        get_shops: function(cb){
            var sql = 'SELECT * FROM `tb_shops` WHERE `shop_name` = ?';
            var params = [shop_name];
            connection.query(sql , params, function(err, resp){
                if(err) cb(err);
                else{
                    if(resp.length){
                        let response = {
                            "statusCode" : 200,
                            "message" : 'Shop is already added...!',
                            "data" : resp || {}
                        }
                        res.send(response);
                    }
                    else{
                        cb();
                    }
                }
            });
        },
        add_shop: ['get_shops', function(err, cb){
            var sql = 'INSERT INTO `tb_shops` (`shop_name`,`shop_author`, `shop_address`) VALUES(?,?,?)';
            var params = [shop_name, shop_author, shop_address];
            connection.query(sql, params, function(err, resp){
                if(err) cb(err);
                else{
                    cb(null, "Shops Added Successfully");
                }
            });
        }]
    }, function(error, result){
        if(error){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else{
            let finalResult = {
                "statusCode" : 200,
                "message" : 'Success',
                "data" : result || {}
            }
            res.send(finalResult);
        }
    });
};

var add_shop_bank = function(req, res){
    let stripe_account_key = req.body.stripe_account_key;
    let shop_id = req.body.shop_id;
    let dataToCreate = {
        client_secret : stripeKeys,
        code: stripe_account_key,
        grant_type : "authorization_code"
    }
    request({
        url: "https://connect.stripe.com/oauth/token",
        method: 'POST',
        json: dataToCreate
    }, function(error, response,result){
        if(error){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else if(result && result.stripe_user_id){
            let sql = 'UPDATE `tb_shops` SET `stripe_account_key` = ? WHERE  `id` = ?';
            let params = [result.stripe_user_id, shop_id];
            connection.query(sql, params, function(err, resp){
                if(err){
                    let finalResult = {
                        "statusCode" : 201,
                        "message" : 'Error in Updating data',
                        "data" : {}
                    }
                    res.send(finalResult);
                }
                else{
                    let finalResult = {
                        "statusCode" : 200,
                        "message" : 'Success in adding bank',
                        "data" : {}
                    }
                    res.send(finalResult);
                }
            })
        }
        else{
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Error in Stripe while adding bank',
                "data" : {}
            }
            res.send(finalResult);
        }
    });
};

var get_all_Shops = function(req, res){
    let sql = 'SELECT * FROM `tb_shops`';
    connection.query(sql, function(err, resp){
        if(err){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else{
            let finalResult = {
                "statusCode" : 200,
                "message" : 'Success',
                "data" : resp || {}
            }
            res.send(finalResult);
        }
    });
};

var get_admin_profile = function(req, res){
    var access_token = req.headers.access_token;
    let sql = 'SELECT * FROM `tb_admin` WHERE `access_token` = ?';
    let params = [access_token];
    connection.query(sql, params, function(err, resp){
        if(err){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else{
            let finalResult = {
                "statusCode" : 200,
                "message" : 'Success',
                "data" : resp || {}
            }
            res.send(finalResult);
        }
    });
};

var get_all_admin = function(req, res){
    let sql = 'SELECT * FROM `tb_admin`';
    connection.query(sql, function(err, resp){
        if(err){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong',
                "data" : {}
            }
            res.send(finalResult);
        }
        else{
            let finalResult = {
                "statusCode" : 200,
                "message" : 'Success',
                "data" : resp || {}
            }
            res.send(finalResult);
        }
    })
}

module.exports = {
    add_admin : add_admin,
    admin_login : admin_login,
    admin_logout : admin_logout,
    get_all_bookings : get_all_bookings,
    add_shops : add_shops,
    add_shop_bank : add_shop_bank,
    get_all_Shops: get_all_Shops,
    get_admin_profile : get_admin_profile,
    get_all_admin : get_all_admin
}