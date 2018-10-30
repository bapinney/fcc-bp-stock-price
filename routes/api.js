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
      console.log("Here is sym...");
      console.log(typeof sym);
      if (typeof sym == "string") { //Only 1 stock entered..
        alpha.data.quote(sym).then(data => {
          console.log(data['Global Quote']['05. price']);
          var price = Number(data['Global Quote']['05. price']).toFixed(2);
          var resJson = {stock: sym, price:price };
          var sm = new StockManager(db);
          console.log("here is req");
          console.dir(req);
          if (req.headers.hasOwnProperty('x-forwarded-for')) {
            var ip = req.headers['x-forwarded-for'].split(',')[0];
          }
          else {
            var ip = req.headers.host.split(':')[0];
          }
          if (req.query.hasOwnProperty('like') && req.query.like === 'true') {
            console.log("User liked this stock");
            sm.addLike(sym, ip);  
          }
          sm.getLikes(sym).then(data => {
            console.log("Get likes promise returned");
            console.dir(data);
            if(data[0].hasOwnProperty('COUNT(*)')) {
              resJson.likes = data[0]['COUNT(*)'];
            }
            else {
              resJson.likes = 0;
            }
            res.json(resJson);
          });
        });  
      }
      else {
        console.dir(req);
        if (req.headers.hasOwnProperty('x-forwarded-for')) {
            var ip = req.headers['x-forwarded-for'].split(',')[0];
          }
        else {
            var ip = req.headers.host.split(':')[0];
        }
        if (req.query.hasOwnProperty('like') && req.query.like === 'true') {
          console.log("User liked both stocks");
          var sm = new StockManager(db);
          sym.forEach(function(cv, i, a) {
            sm.addLike(cv, ip);
          });
        }
        var price = [];
        alpha.data.quote(sym[0]).then(data => {
          console.log(data['Global Quote']['05. price']);
          price[0] = Number(data['Global Quote']['05. price']).toFixed(2);
          console.log("Getting 2nd sym price...");
          alpha.data.quote(sym[1]).then(data => {
            console.log(data['Global Quote']['05. price']);
            price[1] = Number(data['Global Quote']['05. price']).toFixed(2);
            var sm2 = new StockManager(db);
            sm2.compareLikes(sym[0],sym[1]).then(data => {
              console.log("Here is compare data");
              console.dir(data);
              var d = [];
              data.forEach(function(e) { d[e.ticker] = e['COUNT(*)']; })
              res.json({"stockData":[{"stock":sym[0], "price":price[0], "rel_likes": (d[sym[0]] - d[sym[1]])},{"stock":sym[1], "price":price[1], "rel_likes": (d[sym[1]] - d[sym[0]])}]}); 
            });
          });
      });
      
  };   
});
}