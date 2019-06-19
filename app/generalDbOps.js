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

// Helper functions
function _getColors (state) {
    switch (state) {
        case 1: return {bg: 'green', fg: 'white'}; // empty
        case 2: return {bg: 'orange', fg: 'white'}; // guest siting
        case 3: return {bg: 'blue', fg: 'white'}; // order taken
        case 4: return {bg: 'violet', fg: 'white'}; // food served
        case 5: return {bg: 'red', fg: 'white'}; // bill printed
        case 6: return {bg: 'magenta', fg: 'black'}; // tobe cleaned
        default: return {bg: 'grey', fg: 'white'}; // default case; should not come 
    }
}

function _decodeState (state) {
    switch (state) {
        case 1: return 'Empty Table'; // empty
        case 2: return 'Occupied, Order Pending'; // guest siting
        case 3: return 'Order Taken, Food Being Prepared'; // order taken
        case 4: return 'Food Served'; // food served
        case 5: return 'Bill Generated'; // bill printed
        case 6: return 'Table To Be Cleaned'; // tobe cleaned
        default: return 'Unknown State'; // default case; should not come 
    }
}

// Retrieve table numbers from the database
module.exports.getTables = function (fnSuccess, fnError) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            console.log (err);
            fnError ("SYSERROR");
        } else {
            var dbo = db.db(dbName);
            dbo.collection("tableCollection").find({}).toArray(function(err, results) {
                if (err) {
                    console.log (err);
                    fnError ("SYSERROR");
                } else {
                    let tables = [];
                    results.forEach ((result) => {
                        let table = {};
                        table.no = result.tableno;
                        table.statecode = result.state;
                        table.state = _decodeState(result.state);
                        table.waiterName = 'NA';
                        table.color = _getColors (result.state);
                        tables.push (table);
                    });
                    fnSuccess (tables);
                }
            });
        }
        db.close();
    });
}
