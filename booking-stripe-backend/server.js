const express = require('express');
const isPortFree = require('is-port-free');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const config = require('./config/index');
const controller = require('./controller/index');
const Handlebars = require('handlebars');

app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true}));
app.use(bodyParser.json({limit:'200mb'}));

isPortFree(config.CONFIG.PORT.LOCAL).then(function(){
    app.listen(config.CONFIG.PORT.LOCAL, () => console.log(`app listening on port ${config.CONFIG.PORT.LOCAL}!`));
    console.log("YES, PORT IS FREE...!");
}).catch(function(){
    console.log("NO PORT IS NOT FREE");
});

/************************************** API's *************************************************/
app.get('/', function(req, res){
    res.status(200).send({"msg":"success"});
});

app.post('/user_register', controller.USER_CONTROLLER.user_register);
app.post('/user_login', controller.USER_CONTROLLER.user_login);
app.get('/get_user_profile', controller.USER_CONTROLLER.user_profile);
app.post('/user_logout', controller.USER_CONTROLLER.user_logout);

//Booking Api's
app.post('/create_booking', controller.BOOKING_CONTROLLER.create_booking);
app.get('/get_bookings', controller.BOOKING_CONTROLLER.get_bookings);
app.post('/change_booking_status', controller.BOOKING_CONTROLLER.change_booking_status);

//CRUD Api's for card
app.post('/add_card', controller.STRIPE_CONTROLLER.add_card);
app.get('/get_cards', controller.STRIPE_CONTROLLER.get_cards);
app.post('/delete_card', controller.STRIPE_CONTROLLER.delete_card);
app.post('/add_money_to_wallet', controller.STRIPE_CONTROLLER.add_money_to_wallet);
app.get('/get_payment_history', controller.STRIPE_CONTROLLER.get_payment_history);

//Admin Api's
app.post('/add_admin', controller.ADMIN_CONTROLLER.add_admin);
app.post('/admin_login', controller.ADMIN_CONTROLLER.admin_login);
app.get('/admin_logout', controller.ADMIN_CONTROLLER.admin_logout);
app.get('/get_all_bookings', controller.ADMIN_CONTROLLER.get_all_bookings);
app.post('/add_shops', controller.ADMIN_CONTROLLER.add_shops);
app.post('/add_shop_bank', controller.ADMIN_CONTROLLER.add_shop_bank);
app.get('/get_all_shops', controller.ADMIN_CONTROLLER.get_all_Shops);
app.get('/get_admin_profile', controller.ADMIN_CONTROLLER.get_admin_profile);
app.get('/get_all_admins', controller.ADMIN_CONTROLLER.get_all_admin);

//Booking Payment on the stop payment without any promo
app.post('/make_payment', controller.STRIPE_CONTROLLER.make_payment);

//Booking Payment with use of promo and mysql transaction (Real Time scenario -> On the Stop complete payment to shop person)
app.post('/create_booking_promo', controller.TRANSACTION_CONTROLLER.create_booking_promo);

/* Booking Payment with use of promo (Real Time Scenario -> On the stop payment but only user transfer and the promo money tranfer 
    by admin at the end of the day); */
app.post('/create_booking_promo_cron', controller.TRANSACTION_CONTROLLER.create_booking_promo_cron);
controller.TRANSACTION_CONTROLLER.cronOne.start();
console.log('cronOne is running',controller.TRANSACTION_CONTROLLER.cronOne.running);
