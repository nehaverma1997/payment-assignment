const bcrypt = require('bcrypt');
const saltRounds = 10;


var bcryptPassword = function (passwordToCrypt, callback){
    bcrypt.hash(passwordToCrypt, saltRounds, function(err, hash) {
        if(err){
            callback(err);
        }
        else{
            callback(null, hash);
        }
    });
};

var comparePassword = function(passwordToCompare, hash, callback){
    bcrypt.compare(passwordToCompare, hash, function(err, res) {
        if(err){
            callback(err);
        }
        else{
            callback(null,res);
        }
    });
};


module.exports = {
    bcryptPassword,
    comparePassword
}
