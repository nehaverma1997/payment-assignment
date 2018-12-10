const Lib = require('../Lib/index');
const connection = require('../config/index').CONFIG.connection;
const async = require('async');
var stripeKeys = 'sk_test_dKqLvGo1lkA7sDaRfWUP7gHq';
var stripeKeysA = 'pk_test_6LeCiWCnfnx8mIFqEmEzQUb2';
var stripe = require('stripe')(stripeKeys);
var stripeA = require('stripe')(stripeKeysA);

var add_card = function (req, res) {
    let access_token = req.body.access_token;
    let expiry_month = req.body.expiry_month;
    let expiry_year = req.body.expiry_year;
    let card_number = req.body.card_number;
    let cvc_number = req.body.cvc_number;
    let user;
    var manvalues = [access_token, card_number, expiry_month, expiry_year, cvc_number];
    if (manvalues) {
        async.auto({
            get_user: function (cb) {
                let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
                let params = [access_token];
                connection.query(sql, params, function (err, resp) {
                    if (err) {
                        cb(err);
                    }
                    else {
                        user = resp[0].email;
                        cb();
                    }
                })
            },
            add_user_card: ['get_user', function (err, cb) {
                const cardDetails = {
                    number: card_number,
                    exp_month: expiry_month,
                    exp_year: expiry_year,
                    cvc: cvc_number
                }
                stripeA.tokens.create({ card: cardDetails }, (err, stripe_card_info) => {
                    if (err) {
                        cb(err);
                    }
                    else {
                        stripe.customers.create({ source: stripe_card_info.id, email: user }, function (err, card) {
                            if (err) {
                                cb(err)
                            }
                            else {
                                let sql = 'INSERT INTO `tb_users_card` (`user`,`stripe_id`,`card_number`,`card_type`,`stripe_token`,`default`,`id_deleted`) VALUES(?,?,?,?,?,?,?)';
                                let params = [user, card.id, card.sources.data[0].last4, card.sources.data[0].brand, card.sources.data[0].id, 1, 0];
                                connection.query(sql, params, function (err1, resp) {
                                    if (err1) {
                                        cb(err1)
                                    }
                                    else {
                                        cb(null, 'card added successfully..!');
                                    }
                                });
                            }
                        });
                    }
                });
            }]
        }, function (error, result) {
            if (error) {
                let finalResult = {
                    "statusCode": 201,
                    "message": 'Something went wrong',
                    "data": error
                }
                res.send(finalResult);
            }
            else {
                let finalResult = {
                    "statusCode": 200,
                    "message": 'Success',
                    "data": result
                }
                res.send(finalResult);
            }
        })
    }
    else {
        let finalResult = {
            "statusCode": 201,
            "message": 'Parameter Missing',
            "data": {}
        }
        res.send(finalResult);
    }
};


var get_cards = function (req, res) {
    let access_token = req.headers.access_token;;
    var user_email;
    async.auto({
        get_user: function (cb) {
            let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
            let params = [access_token];
            connection.query(sql, params, function (err, resp) {
                if (err) {
                    cb(err);
                }
                else {
                    user_email = resp[0].email;
                    cb();
                }
            });
        },
        get_card: ['get_user', function (err, cb) {
            let sql = 'SELECT * FROM `tb_users_card` WHERE `user`=? AND `default` = ? AND `id_deleted` = ?';
            let params = [user_email, 1, 0];
            connection.query(sql, params, function (err1, resp) {
                if (err1) {
                    cb(err1);
                }
                else {
                    cb(null, resp[0]);
                }
            })
        }]
    }, function (error, result) {
        if (error) {
            let finalResult = {
                "statusCode": 201,
                "message": 'Something went wrong',
                "data": {}
            }
            res.send(finalResult);
        }
        else {
            let finalResult = {
                "statusCode": 200,
                "message": 'Success',
                "data": result
            }
            res.send(finalResult);
        }
    });
};

var delete_card = function (req, res) {
    var access_token = req.body.access_token;
    var user;
    async.auto({
        get_user: function (cb) {
            let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
            let params = [access_token];
            connection.query(sql, params, function (err, resp) {
                if (err) {
                    cb(err);
                }
                else {
                    user = resp[0].email;
                    cb();
                }
            });
        },
        delete_card: ['get_user', function (err, cb) {
            let sql = 'UPDATE `tb_users_card` SET `default` = ? AND `id_deleted` = ?';
            let params = [0, 1];
            connection.query(sql, params, function (err1, resp) {
                if (err1) {
                    cb(err1);
                }
                else {
                    cb(null, "Card deleted successfully..!");;
                }
            })
        }]
    }, function (error, result) {
        if (error) {
            let finalResult = {
                "statusCode": 201,
                "message": 'Something went wrong',
                "data": {}
            }
            res.send(finalResult);
        }
        else {
            let finalResult = {
                "statusCode": 200,
                "message": 'Success',
                "data": result
            }
            res.send(finalResult);
        }
    });
};

var add_money_to_wallet = function (req, res) {
    var access_token = req.body.access_token;
    var amount = req.body.amount;
    var user, stripe_id, stripe_token, previous_amount;
    var money=amount;
    money = Number(money);
    async.auto({
        get_user: function (cb) {
            let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
            let params = [access_token];
            connection.query(sql, params, function (err, resp) {
                if (err) {
                    cb(err);
                }
                else {
                    user = resp[0].email;
                    previous_amount = resp[0].wallet;
                    previous_amount = Number(previous_amount);
                    cb();
                }
            })
        },
        get_card: ['get_user', function (err, cb) {
            let sql = 'SELECT * FROM `tb_users_card` WHERE `user` = ?';
            let params = [user];
            connection.query(sql, params, function (err1, resp) {
                if (err1) {
                    cb(err1);
                }
                else {
                    stripe_id = resp[0].stripe_id;
                    stripe_token = resp[0].stripe_token;
                    cb();
                }
            })
        }],
        add_money: ['get_card', function (err, cb) {
            try {
                amount = Number(amount);
            } catch (e) {
                cb(e);
            }
            stripe.charges.create({
                amount: amount * 100,
                currency: 'usd',
                description: "add money to wallet",
                customer: stripe_id,
                card: stripe_token
            }, function (err, charge) {
                if (err) {
                    cb(err);
                }
                else {
                    if (previous_amount == null) {
                        previous_amount = 0;
                    }
                    let dataToUpdate = previous_amount + money;
                    let sql = 'UPDATE `tb_users` SET `wallet` = ? WHERE `email` = ?';
                    let params = [dataToUpdate, user];
                    connection.query(sql, params, function (err1, resp) {
                        if (err1) {
                            cb(err1);
                        }
                        else {
                            cb(null, "amount added to wallet");
                        }
                    });
                }
            });
        }]
    }, function (error, result) {
        if (error) {
            let finalResult = {
                "statusCode": 201,
                "message": 'Something went wrong',
                "data": {}
            }
            res.send(finalResult);
        }
        else {
            let finalResult = {
                "statusCode": 200,
                "message": 'Success',
                "data": result
            }
            res.send(finalResult);
        }
    });
};

var get_payment_history = function (req, res) {
    var access_token = req.headers.access_token;;
    var user;
    async.auto({
        get_user: function (cb) {
            let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
            let params = [access_token];
            connection.query(sql, params, function (err, resp) {
                if (err) {
                    cb(err);
                }
                else {
                    user = resp[0].email;
                    cb();
                }
            })
        },
        get_payment_historys: ['get_user', function (err, cb) {
            let sql = 'SELECT * FROM `tb_payment_history` INNER JOIN `tb_bookings` ON `tb_payment_history`.`booking_id`=`tb_bookings`.`id` WHERE `tb_payment_history`.`user`=?';
            let params = [user];
            connection.query(sql, params, function (err1, resp) {
                if (err1) {
                    cb(err1);
                }
                else {
                    cb(null, resp);
                }
            })
        }]
    }, function (error, result) {
        if (error) {
            let finalResult = {
                "statusCode": 201,
                "message": 'Something went wrong',
                "data": {}
            }
            res.send(finalResult);
        }
        else {
            let finalResult = {
                "statusCode": 200,
                "message": 'Success',
                "data": result
            }
            res.send(finalResult);
        }
    });
};

var make_payment = function (req, res) {
    
    let bookingId = req.body.data.id;
    let access_token = req.body.access_token;
    let user;
    let stripe_id;
    let stripe_token;
    let cost;
    let charge1;
    let shop_account;
    async.auto({
        get_user: function (cb) {
            let sql = 'SELECT * FROM `tb_users` WHERE `access_token` = ?';
            let params = [access_token];
            connection.query(sql, params, function (err, resp) {
                if (err) {
                    cb(err);
                }
                else {
                    user = resp[0].email;
                    cb();
                }
            })
        },
        get_card: ['get_user', function (err, cb) {
            let sql = 'SELECT * FROM `tb_users_card` WHERE `user` = ?';
            let params = [user];
            connection.query(sql, params, function (err1, resp) {
                if (err1) {
                    cb(err1);
                }
                else if (resp.length) {
                    stripe_id = resp[0].stripe_id;
                    stripe_token = resp[0].stripe_token;
                    cb();
                }
                else {
                    let response = {
                        "statusCode": 201,
                        "message": "No, Card Added",
                        "data": {}
                    }
                    res.send(response);
                }
            })
        }],
        get_shop_account: function (cb) {
            let sql = 'SELECT `stripe_account_key` FROM `tb_shops` WHERE `id`= 1';
            connection.query(sql, function (err, resp) {
                if (err) {
                    cb(err);
                }
                else {
                    shop_account = resp;
                    cb();
                }
            })
        },
        get_booking: function (cb) {
            let sql = 'SELECT * FROM `tb_bookings` WHERE id = ? AND `booking_status` = ? AND `payment_status` = ?';
            let params = [bookingId, 'Success', 'Pending'];
            connection.query(sql, params, function (err1, resp) {
                if (err1) {
                    cb(err1);
                }
                else {
                    cost = resp[0].price;
                    cb();
                }
            });
        },
        make_payment: ['get_card', 'get_booking', 'get_shop_account', function (err, cb) {
            try {
                cost = Number(cost);
            } catch (e) {
                cb(e);
            }
            charge = stripe.charges.create({
                amount: cost * 100,
                currency: "usd",
                customer: stripe_id,
                card: stripe_token,
                description: 'make payment to shop',
                destination: {
                    account: shop_account
                },
                metadata: { 'user': user, 'bookingId': bookingId }
            }, function (err, charge) {
                if (err && (err.type == 'StripeCardError' || err.type == "parameter_unknown")) {
                    let response = {
                        error: error,
                        cost: cost,
                        status: 'failed'
                    };
                    cb(null, response);
                }
                else {
                    let response = {
                        cost: cost,
                        status: 'Success',
                        charge: charge
                    };
                    let sql = 'UPDATE `tb_bookings` SET `payment_status` = ? WHERE id = ?';
                    let params = ['Success', bookingId];
                    connection.query(sql, params, function (err1, resp) {
                        if (err1) {
                            cb(err1);
                        }
                        else {
                            cb(null, response)
                        }
                    });
                }
            });
        }]
    }, function (error, result) {
        if (error) {
            let finalResponse = {
                "statusCode": 201,
                "message": "Something went wrong.!",
                "data": {}
            }
            res.send(finalResponse);
        }
        else {
            if (result.make_payment.charge == null) {
                charge1 = '';
            }
            let finalResult = {
                cost: cost,
                status: result.make_payment.status,
                charge: charge1,
                user: user,
                bookingId: bookingId
            }
            let sql = 'INSERT INTO `tb_payment_history` (`cost`,`status`,`charge`,`user`,`booking_id`) VALUES(?,?,?,?,?)';
            let params = [finalResult.cost, finalResult.status, finalResult.charge, finalResult.user, finalResult.bookingId];
            connection.query(sql, params, function (err, resp) {
                if (err) {
                    let finalResult1 = {
                        "statusCode": 201,
                        "message": 'Something Went Wrong',
                        "data": {}
                    }
                    res.send(finalResult1);
                }
                else {
                    let finalResult1 = {
                        "statusCode": 200,
                        "message": 'Success',
                        "data": "Payment Successfull"
                    }
                    res.send(finalResult1);
                }
            });
        }
    });
}

module.exports = {
    add_card: add_card,
    get_cards: get_cards,
    delete_card: delete_card,
    add_money_to_wallet: add_money_to_wallet,
    get_payment_history: get_payment_history,
    make_payment: make_payment
}