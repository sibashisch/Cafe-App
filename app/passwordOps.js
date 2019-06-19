var crypto = require ('crypto');
var PropertiesReader = require('properties-reader');

var properties = new PropertiesReader('./dbinfo');

let dbHost = properties._properties.DB_HOST;
let dbPort = properties._properties.DB_PORT;
let dbName = properties._properties.DB_NAME;
let dbUser = properties._properties.DB_USER;
let dbPass = properties._properties.DB_PASS;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://"+encodeURIComponent(dbUser)+":"+encodeURIComponent(dbPass)+"@"+dbHost+":"+dbPort+"/"+dbName;

// generate random salt for new users
module.exports.generateNewSalt = function () {
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  	for (var i = 0; i < 24; i++)
    	text += possible.charAt(Math.floor(Math.random() * possible.length));

  	return text;
}

// returns hashed password
function encryptSHA (pwd, salt) {
    return crypto.createHash('sha256').update(pwd+salt).digest('base64');
}

// Check Login
module.exports.loginUser = function (userName, passwd, session, fnSuccess, fnError) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            console.log (err);
            fnError ("SYSERROR");
        } else {
            var dbo = db.db(dbName);
            dbo.collection("userCollection").findOne({username: userName}, function(err, result) {
                if (err) {
                    console.log (err);
                    fnError ("SYSERROR");
                } else {
                    //if (result && (result.password === encryptSHA (pwd, result.salt))) {
                    if (result && (result.password === passwd)) {
                        session.user = result.username;
                        session.role = result.role;
                        fnSuccess ();
                    } else {
                        fnError ("AUTHFAIL");
                    }
                }
            });
            db.close();
        }
    });
}
