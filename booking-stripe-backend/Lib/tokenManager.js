const jsonWebToken = require('jsonwebtoken');
const secretKey = require('../config/index').CONFIG.JWT_SECRET_KEY;

//Create Token
var createToken = function(dataToCreate){
    var token =  jsonWebToken.sign(dataToCreate, secretKey);
    return token;
 
};
 
//Verify Token
var verifyToken = function(token, flag){
     let data = jsonWebToken.verify(token, secretKey);
     return data;
};
 
//Decode Token
var decodeToken = function(token){
    var decodeResult = jsonWebToken.decode(token, {complete: true});
    return decodeResult;
};

module.exports = {
     createToken,
     verifyToken,
     decodeToken
};