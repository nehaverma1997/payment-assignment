var Lib = require('../Lib/index');
const async = require('async');
const connection = require('../config/index').CONFIG.connection;

var create_booking = function(req, res){
    let access_token = req.body.access_token;
    let item_type = req.body.item_type;
    let quantity = req.body.quantity;
    let price = req.body.price;
    let manvalues = [access_token, item_type, quantity, price];
    let user;
    if(manvalues){
        async.auto({
            get_user: function(cb){
                let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?'
                let params = [access_token];
                connection.query(sql, params, function(err, resp){
                    if(err){
                        cb(err);
                    }
                    else{
                        user = resp[0].email;
                        cb();
                    }
                });
            },
            insert_booking : ['get_user', function(err, cb){
                let sql = 'INSERT INTO `tb_bookings` (`item_type`,`quantity`,`price`,`booking_status`,`payment_status`,`user`) VALUES(?,?,?,?,?,?)';
                let params = [item_type, quantity, price, 'Success', 'Pending', user];
                connection.query(sql, params, function(err1, resp){
                    if(err1){
                        cb(err1);
                    }
                    else{
                        cb(null, "Booking Created SuccessFully");
                    }
                })
            }]
        }, function(error, result){
            if(error) {
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
                    "data" : result
                }
                res.send(finalResult);
            }
        });
    }else{
        let finalResult = {
            "statusCode" : 201,
            "message" : 'Parameter Missing',
            "data" : {}
        }
        res.send(finalResult);
    }
};

var get_bookings = function(req, res){
    let access_token = req.headers.access_token;
    let user;
    async.auto({
        get_user: function(cb){
            let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
            let params = [access_token];
            connection.query(sql, params, function(err, resp){
                if(err){
                    cb(err);
                }
                else{
                    user = resp[0].email;
                    cb();
                }
            });
        },
        get_booking_data: ['get_user', function(err, cb){
            let sql = 'SELECT * FROM `tb_bookings` WHERE `user`= ?';
            let params = [user];
            connection.query(sql,params, function(err1, resp){
                if(err1){
                    cb(err1);
                }
                else{
                    cb(null, resp);
                }
            })
        }]
    }, function(error, result){
        if(error) {
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
                "data" : result.get_booking_data
            }
            res.send(finalResult);
        }
    });
};

var change_booking_status = function(req, res){
    let bookingId = req.body.bookingId;
    let booking_Status = req.body.booking_Status;
    let sql = 'UPDATE `tb_bookings` SET `booking_status`= ? WHERE id = ?';
    let params = [booking_Status, bookingId];
    connection.query(sql, params, function(err, resp){
        if(err) {
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
}

module.exports = {
    create_booking          : create_booking,
    get_bookings            : get_bookings,
    change_booking_status   : change_booking_status
}