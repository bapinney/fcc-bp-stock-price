const https = require("https");
const Stocks = require("../models/Stocks.js");

class StockManager{
  
  constructor(mongoosedb) {
    this.db = mongoosedb;
  }
  
  addLike(sym, ip) {
    console.log("Addlike called for " + sym + " with IP: " + ip);
    var like = new Stocks({ticker: "CSIQ", ip:"1.2.3.4"}); 
    console.log("new model");
    like.save(function(err) { 
      console.log("Inside like.save");
      if (err) {
        console.log(err);
      }
      console.log("Like added!");
    });
  }
  
}

module.exports = StockManager;
