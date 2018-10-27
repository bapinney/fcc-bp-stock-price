/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

var alpha = require('alphavantage')({ key: 'qweqweqwe' });;


// const DB = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const StockManager = require("../controllers/stockManager");
const https = require('https');

module.exports = function (app, db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      //console.dir(req);
      var sym = req.query.stock;
      alpha.data.quote(sym).then(data => {
        console.log(data['Global Quote']['05. price']);
        res.json({stock: sym, price:data['Global Quote']['05. price'] });
        var sm = new StockManager(db);        
        sm.addLike(sym, "1.2.3.4");
      });
    
  });   
};
