var mysql = require('mysql');

//Connect to mysql
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database : "booking_stripe"
});
connection.connect(function(err) {
    if (err) {throw err}
    console.log("MySql Db Connected!");
});

var PORT = {
    LOCAL: 4444
};

var JWT_SECRET_KEY = 'sUPerSeCuREKeY&^$^&$^%$^%7782348723t4872t34Ends';

module.exports = {
    connection      : connection,
    PORT           : PORT,
    JWT_SECRET_KEY  : JWT_SECRET_KEY
}
