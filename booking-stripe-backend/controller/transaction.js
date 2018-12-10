const connection = require('../config/index').CONFIG.connection;
const async = require('async');
var stripeKeys = 'sk_test_dKqLvGo1lkA7sDaRfWUP7gHq';
var stripeKeysA = 'pk_test_6LeCiWCnfnx8mIFqEmEzQUb2';
var stripe = require('stripe')(stripeKeys);
var stripeA = require('stripe')(stripeKeysA);
var CronJob = require('cron').CronJob;

/********************************** FOR ON THE STOP PAYMENT TO SHOP AUTHOR (USER USED PROMO) ************************************/

var create_booking_promo = function (req, res) {
    let access_token = req.body.access_token;
    let item_type = req.body.item_type;
    let quantity = req.body.quantity;
    let price = req.body.price;
    let promo = req.body.promo;
    let shop_id = req.body.shop_id;
    let user_wallet, user, price_after_promo, shop_stripe_account_key;
    /***** BEGIN TRANSACTION *****/
    connection.beginTransaction(function (error) {
        if (error) {
            let finalResult = {
                "statusCode": 201,
                "message": 'Something went wrong',
                "data": {}
            }
            res.send(finalResult);
        }
        let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
        let params = [access_token];
        connection.query(sql, params, function (err, resp) {
            if (err) {
                connection.rollback(function () {
                    res.send(err);
                });
            }
            user = resp[0].email;
            user_wallet = resp[0].wallet;
            price_after_promo = price - promo;
            if (user_wallet < price_after_promo) {
                let finalResult = {
                    "statusCode": 201,
                    "message": 'Kindly add money to your wallet to make booking',
                    "data": {}
                }
                return res.send(finalResult);
            }
            let sql = 'INSERT INTO `tb_bookings` (`user`,`item_type`,`quantity`,`price`,`booking_status`,`payment_status`) VALUES(?,?,?,?,?,?)';
            let params = [user, item_type, quantity, price, 'Success', `Pending`];
            connection.query(sql, params, function (err, booking_resp) {
                if (err) {
                    connection.rollback(function () {
                        return res.send(err);
                    });
                }
                let sql = 'UPDATE `tb_users` SET `wallet` =  `wallet` - ? WHERE `email` = ?';
                let params = [price_after_promo, user];
                connection.query(sql, params, function (err, resp) {
                    if (err) {
                        connection.rollback(function () {
                            return res.send(err);
                        })
                    }
                    let sql = 'UPDATE `tb_shops` SET `shop_wallet` =  `shop_wallet` + ? WHERE `id` = ?';
                    let params = [price, shop_id];
                    connection.query(sql, params, function (err, resp) {
                        if (err) {
                            connection.rollback(function () {
                                res.send(err);
                            });
                        }
                        let sql = 'UPDATE `tb_admin` SET `admin_wallet` = `admin_wallet` + ?';
                        let params = [price];
                        connection.query(sql, params, function (err, resp) {
                            if (err) {
                                connection.rollback(function () {
                                    return res.send(err);
                                })
                            }
                            let sql = 'SELECT `stripe_account_key` FROM `tb_shops` WHERE `id` = ?';
                            let params = [shop_id];
                            connection.query(sql, params, function (err, resp) {
                                if (err) {
                                    connection.rollback(function () {
                                        return res.send(err);
                                    })
                                }
                                shop_stripe_account_key = resp[0].stripe_account_key;
                                try {
                                    price = Number(price);
                                } catch (e) {
                                    cb(e);
                                }
                                stripe.transfers.create({
                                    amount: price * 100,
                                    currency: "usd",
                                    destination: shop_stripe_account_key
                                }, function (error1, charge) {
                                    if (error1) {
                                        connection.rollback(function () {
                                            let finalResult = {
                                                "statusCode": 201,
                                                "message": 'Error in Transfering money via stripe',
                                                "data": {}
                                            }
                                            return res.send(finalResult);
                                        })
                                    }
                                    else {
                                        connection.commit(function (err1) {
                                            if (err1) {
                                                connection.rollback(function () {
                                                    return res.send(err1);
                                                });
                                            }
                                            else {
                                                let sql = 'UPDATE `tb_bookings` SET `payment_status` = ?  WHERE id = ?';
                                                let params = ['Success', booking_resp.insertId];
                                                connection.query(sql, params, function (err, resp) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            return res.send(err1);
                                                        })
                                                    }
                                                    else {
                                                        let sql = 'INSERT INTO `tb_payment_history` (`cost`,`status`,`charge`,`user`,`booking_id`) VALUES(?,?,?,?,?)';
                                                        let params = [price, 'Success', charge, user, booking_resp.insertId];
                                                        connection.query(sql, params, function(err, resp){
                                                            if(err){
                                                                connection.rollback(function(){
                                                                    return res.send(err);
                                                                })
                                                            }
                                                            else{
                                                                let finalResult = {
                                                                    "statusCode": 200,
                                                                    "message": 'Booking created and successfully Payment done',
                                                                    "data": {}
                                                                }
                                                                return res.send(finalResult);
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    })
};

var create_booking_promo_cron = function (req, res) {
    let access_token = req.body.access_token;
    let item_type = req.body.item_type;
    let quantity = req.body.quantity;
    let price = req.body.price;
    let promo = req.body.promo;
    let shop_id = req.body.shop_id;
    let user_wallet, user, price_after_promo, shop_stripe_account_key, stripe_id, stripe_token;
    /***** BEGIN TRANSACTION *****/
    connection.beginTransaction(function (error) {
        if (error) {
            let finalResult = {
                "statusCode": 201,
                "message": 'Something went wrong',
                "data": {}
            }
            return res.send(finalResult);
        }
        let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
        let params = [access_token];
        connection.query(sql, params, function (err, resp) {
            if (err) {
                connection.rollback(function () {
                    return res.send(err);
                });
            }
            user = resp[0].email;
            user_wallet = resp[0].wallet;
            price_after_promo = price - promo;
            if (user_wallet < price_after_promo) {
                let finalResult = {
                    "statusCode": 201,
                    "message": 'Kindly add money to your wallet to make booking',
                    "data": {}
                }
                res.send(finalResult);
            }
            let sql = 'INSERT INTO `tb_bookings` (`user`,`item_type`,`quantity`,`price`,`booking_status`,`payment_status`) VALUES(?,?,?,?,?,?)';
            let params = [user, item_type, quantity, price, 'Success', `Pending`];
            connection.query(sql, params, function (err, booking_resp) {
                if (err) {
                    connection.rollback(function () {
                        return res.send(err);
                    });
                }
                let sql = 'UPDATE `tb_users` SET `wallet` =  wallet - ? WHERE email = ?';
                let params = [price_after_promo, user];
                connection.query(sql, params, function (err, resp) {
                    if (err) {
                        connection.rollback(function () {
                            return res.send(err);
                        })
                    }
                    let sql = 'UPDATE `tb_shops` SET `shop_wallet` =  shop_wallet + ? WHERE id = ?';
                    let params = [price_after_promo, shop_id];
                    connection.query(sql, params, function (err, resp) {
                        if (err) {
                            connection.rollback(function () {
                                return res.send(err);
                            });
                        }
                        let sql = 'UPDATE `tb_admin` SET `pending_amount` = pending_amount + ? WHERE `id` = 1';
                        let params = [promo];
                        connection.query(sql, params, function (err, resp) {
                            if (err) {
                                connection.rollback(function () {
                                    return res.send(err);
                                })
                            }
                            let sql = 'SELECT `stripe_account_key` FROM `tb_shops` WHERE `id` = ?';
                            let params = [shop_id];
                            connection.query(sql, params, function (err, resp) {
                                if (err) {
                                    connection.rollback(function () {
                                        return res.send(err);
                                    })
                                }
                                shop_stripe_account_key = resp[0].stripe_account_key;
                                let sql = 'SELECT `stripe_id`, `stripe_token` FROM `tb_users_card` WHERE `user` = ?';
                                let params = [user];
                                connection.query(sql, params, function (err, resp) {
                                    if (err) {
                                        connection.rollback(function () {
                                            return res.send(err);
                                        })
                                    }
                                    stripe_id = resp[0].stripe_id;
                                    stripe_token = resp[0].stripe_token;
                                    try {
                                        price_after_promo = Number(price_after_promo);
                                    } catch (e) {
                                        connection.rollback(function () {
                                            return res.send(e);
                                        })
                                    }
                                    charge = stripe.charges.create({
                                        amount: price_after_promo * 100,
                                        currency: "usd",
                                        customer: stripe_id,
                                        card: stripe_token,
                                        description: 'make payment to shop',
                                        destination: {
                                            account: shop_stripe_account_key
                                        },
                                        metadata: { 'user': user, 'bookingId': booking_resp.insertId }
                                    }, function (err, charge) {
                                        if (err && (err.type == 'StripeCardError' || err.type == "parameter_unknown")) {
                                            let response = {
                                                error: error,
                                                cost: price_after_promo,
                                                status: 'failed'
                                            };
                                            connection.rollback(function () {
                                                return res.send(response);
                                            })
                                        }
                                        else {
                                            connection.commit(function (err1) {
                                                if (err1) {
                                                    connection.rollback(function () {
                                                        return res.send(err1);
                                                    });
                                                }
                                                else {
                                                    let response = {
                                                        cost: price_after_promo,
                                                        status: 'Success',
                                                        charge: charge
                                                    };
                                                    let sql = 'UPDATE `tb_bookings` SET `payment_status` = ? WHERE id = ?';
                                                    let params = ['Success', booking_resp.insertId];
                                                    connection.query(sql, params, function (err1, resp) {
                                                        if (err1) {
                                                            connection.rollback(function () {
                                                                return res.send(err1);
                                                            })
                                                        }
                                                        else {
                                                            let sql = 'INSERT INTO `tb_payment_history` (`cost`,`status`,`charge`,`user`,`booking_id`) VALUES(?,?,?,?,?)';
                                                            let params = [price_after_promo, 'Success', charge.status, user, booking_resp.insertId]
                                                            connection.query(sql, params, function (err1, resp) {
                                                                if (err1) {
                                                                    connection.rollback(function () {
                                                                        return res.send(err1);
                                                                    });
                                                                }
                                                                else {
                                                                    let finalResult = {
                                                                        "statusCode": 200,
                                                                        "message": 'Booking created and successfully Payment done',
                                                                        "data": {}
                                                                    }
                                                                    res.send(finalResult);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

let cronOne = new CronJob('* * 21 * *', function(req, res){
    var pending_amount,admin_wallet,username,shop_wallet,shop_stripe_account_key;
    /***** BEGIN TRANSACTION *****/
    connection.beginTransaction(function (error) {
        if (error) {
            let finalResult = {
                "statusCode": 201,
                "message": 'Something went wrong',
                "data": {}
            }
            res.send(finalResult);
        }
        let sql = 'SELECT * FROM `tb_admin` WHERE `id`= 1';
        connection.query(sql, function(err, resp){
            if(err){
                connection.rollback(function () {
                    res.send(err);
                });
            }
            pending_amount = resp[0].pending_amount;
            let sql = 'SELECT * FROM `tb_shops` WHERE `id` = 1';
            connection.query(sql, function(err, resp){
                if(err){
                    connection.rollback(function () {
                        res.send(err);
                    });
                }
                shop_wallet = resp[0].shop_wallet;
                shop_stripe_account_key = resp[0].stripe_account_key;
                try{
                    pending_amount = Number(pending_amount);
                }catch(e){
                    cb(e);
                }
                stripe.transfers.create({
                    amount: pending_amount * 100,
                    currency: "usd",
                    destination: shop_stripe_account_key
                }, function(error1, charge){
                    if(error1){
                        connection.rollback(function(){
                            let finalResult = {
                                "statusCode": 201,
                                "message": 'Error in Transfering money via stripe',
                                "data": {}
                            }
                            res.send(finalResult);
                        })
                    }
                    else{
                        connection.commit(function(err1){
                            if(err1){
                                connection.rollback(function(){
                                    res.send(err1);
                                });
                            }
                            let sql = 'UPDATE `tb_shops` SET `shop_wallet` = `shop_wallet` + ? WHERE `id` = 1';
                            let params = [pending_amount];
                            connection.query(sql, params, function(err, resp){
                                if(err){
                                    connection.rollback(function(){
                                        res.send(err);
                                    })
                                }
                                else{
                                    let sql = 'UPDATE `tb_admin` SET `pending_amount` = `pending_amount` - ? WHERE `id` = 1';
                                    let params = [pending_amount];
                                    connection.query(sql, params, function(err, resp){
                                        if(err){
                                            connection.rollback(function(){
                                                res.send(err);
                                            })
                                        }
                                        else{
                                            let finalResult = {
                                                "statusCode": 200,
                                                "message": 'All pending payments cleared',
                                                "data": {}
                                            }
                                            res.send(finalResult);
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });
        });
    });
});


module.exports = {
    create_booking_promo: create_booking_promo,
    create_booking_promo_cron: create_booking_promo_cron,
    cronOne:cronOne
}