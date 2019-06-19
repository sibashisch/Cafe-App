var express = require ('express');
var path = require ('path');	// required for sending files over get
var bodyParser = require ('body-parser');
var session = require ('express-session');

var pwdOps = require ('./passwordOps');
var dbOps = require ('./generalDbOps');

var router = express.Router();

// export the router so that we can use it in server.js
module.exports = router; 

// use the bodyparser to parse url data to json
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// use the session functionality
router.use(session({secret: 'cafeappsessionsss', resave: true, saveUninitialized: false}));

// Route for home page
router.get ('/', function(req, res) {
    res.render ('pages/index');
});

router.get ('/contact', function(req, res) {
    res.render ('pages/contact');
});

router.post ('/login', function(req, res) {
    var sess = req.session;
    pwdOps.loginUser (req.body.uname, req.body.pswd, sess, function() {
        if (!sess || !sess.role || !sess.user) {
            res.render ('pages/index', {text: 'Could not log you in.'});
        } else if (sess.role === 'reception') {
            dbOps.getTables (function (tables) {
                res.render ('pages/tableview', {username: sess.user, tables: tables});
            },
            function () {
                console.log ('err');
            });
        } else if (sess.role === 'kitchen') {
            res.send ('kitchen');
        } else if (sess.role === 'admin') {
            res.send ('admin');
        } else {
            res.render ('pages/index', {text: 'Your role is not defined. Contact Administrator.'});
        }    
    }, 
    function(errCode) {
        let message = '';
        if (errCode === 'SYSERROR') {
            message = 'Some error occurred.'
        } else if (errCode === 'AUTHFAIL') {
            message = 'Invalid username password combination';
        } else {
            message = 'System error occurred';
        }
        res.render ('pages/index', {text: message});
    });
});

router.get ('/logout',function(req,res) {
    req.session.destroy (function(err) {
        if(err) {
            console.log(err);
        } else {
            res.render ('pages/index', {text: 'successfully logged out', style: 'ok'});
        }
    });
});
