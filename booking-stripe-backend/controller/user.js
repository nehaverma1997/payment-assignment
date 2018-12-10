const Lib = require('../Lib/index');
const connection = require('../config/index').CONFIG.connection;
const async = require('async');

var user_register = function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var phone = req.body.phone;
    var encrypt_pass;
    async.auto({
        get_user: function(cb){
            let sql = 'SELECT * FROM `tb_users` WHERE email = ?'
            let params = [email];
            connection.query(sql, params, function(err, resp){
                if(err){
                    cb(err);
                }
                else{
                    if(resp.length){
                        let finalResult = {
                            "statusCode" : 201,
                            "message" : 'User Already Registered. Kindly Login.!',
                            "data" : {}
                        }
                        res.send(finalResult);
                    }
                    else{
                        cb();
                    }
                }
            });
        },
        password_bcrypt : function(cb){
            Lib.UNIVERSAL_FUNCTION.bcryptPassword(password, function(err, resp){
                if(err) cb(err);
                else{
                    encrypt_pass = resp;
                    cb();
                }
            });
        },
        add_user: ['get_user','password_bcrypt', function(err, cb){
            let sql = 'INSERT INTO `tb_users` (`email`,`password`,`name`,`phone`) VALUES(?,?,?,?)';
            let params = [email, encrypt_pass, name, phone];
            connection.query(sql, params, function(err, resp){
                if(err) cb(err);
                else{
                    cb(null, "USER REGISTERED SUCCESSFULLY..!");
                }
            });
        }]
    }, function(error, result){
        if(error){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong.!',
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

var user_login = function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var access_token;
    var password_to_compare;
    async.auto({
        get_user: function(cb){
            let sql = 'SELECT `email`,`password` FROM `tb_users` WHERE `email`=?';
            let params = [email];
            connection.query(sql, params, function(err, resp){
                if(err) {
                    cb(err);
                }
                else{
                    password_to_compare = resp[0].password;
                    cb();
                }
            });
        },
        check_password: ['get_user', function(err, cb){
            Lib.UNIVERSAL_FUNCTION.comparePassword(password, password_to_compare, function(err1, resp){
                if(err1) {
                    cb(err1);
                }
                else{
                    if(resp){
                        cb();
                    }
                    else{
                        let response = {
                            "statusCode" : 201,
                            "message" : 'Password incorrect',
                            "data" : {}
                        }
                        res.send(response);
                    }
                }
            });
        }],
        login_user: ['check_password', function(err, cb){
            access_token = Lib.TOKEN_MANAGER.createToken(email);
            let sql = 'UPDATE `tb_users` SET `access_token` = ? WHERE `email` = ?';
            let params = [access_token, email];
            connection.query(sql, params, function(err1, resp){
                if(err1) {
                    cb(err1);
                }
                else{
                    cb(null, access_token);
                }
            })
        }]
    }, function(error, result){
        if(error){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong.!',
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

var user_logout = function(req, res){
    var access_token = req.body.access_token;
    var email ;
    async.auto({
        get_user: function(cb){
            let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
            let params = [access_token];
            connection.query(sql, params, function(err, resp){
                if(err) {
                    cb(err);
                }
                else if(resp.length){
                    email = resp[0].email;
                    cb();
                }
                else{
                    let response = {
                        "statusCode" : 201,
                        "message" : 'User not found .!',
                        "data" : {}
                    }
                    res.send(response);
                }
            });
        },
        logout_user: ['get_user', function(err, cb){
            let sql = 'UPDATE `tb_users` SET `access_token`= null WHERE `email` = ?'
            let params = [email];
            connection.query(sql, params, function(err1, resp){
                if(err1){
                    cb(err1);
                }
                else{
                    cb(null, 'User Logout Successfully');
                }
            })
        }]
    }, function(error, result){
        if(error){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong.!',
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
    })
}

var user_profile = function(req, res){
    var access_token = req.headers.access_token;
    let sql = 'SELECT * FROM `tb_users` WHERE `access_token`=?';
    let params = [access_token];
    connection.query(sql, params, function(err, resp){
        if(err){
            let finalResult = {
                "statusCode" : 201,
                "message" : 'Something went wrong.!',
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

module.exports = {
    user_register : user_register,
    user_login    : user_login,
    user_logout   : user_logout,
    user_profile  : user_profile
}