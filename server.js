var express = require ('express');
var expressLayouts = require ('express-ejs-layouts');

var app = express();
var port = 8080;

// use ejs and express-layouts
app.set ('view engine', 'ejs');
app.use (expressLayouts);

// lets connect the routs file
var router = require ('./app/routs');
app.use ('/', router); // use is a middleware function with access to all req and res objects


// location of static contents
app.use (express.static(__dirname + "/public"));

// Start the server
app.listen (process.env.PORT || port, function() {
    console.log ("app started");
});