const https = require("https");
const Stocks = require("../models/Stocks.js");

class StockManager {

    constructor(mongoosedb) {
        this.db = mongoosedb;
    }

    addLike(sym, ip) {
        console.log("Addlike called for " + sym + " with IP: " + ip);
        var like = new Stocks({
            ticker: sym,
            ip: ip
        });
        console.log("new model");
        like.save(function(err) {
            console.log("Inside like.save");
            if (err) {
                console.log(err);
            }
            console.log("Like added!");
        });
    }

    getLikes(sym) {
        var mongodb = require("mongodb");
        var client = mongodb.MongoClient;
        var url = process.env.DB;
        return new Promise((resolve, reject) => {
          client.connect(url, function(err, client) {

              var db = client.db("fcc_sandbox");
              var collection = db.collection("stocks");

              var options = {
                  allowDiskUse: true
              };
            
            var pipeline = [
              {
                  "$match": {
                      "ticker": sym
                  }
              }, 
              {
                  "$group": {
                      "_id": {
                          "ticker": "$ticker"
                      },
                      "COUNT(*)": {
                          "$sum": 1
                      }
                  }
              }, 
              {
                  "$project": {
                      "_id": 0,
                      "ticker": "$_id.ticker",
                      "COUNT(*)": "$COUNT(*)"
                  }
              }
            ];
            var cursor = collection.aggregate(pipeline, options);
            var results = [];
/*            cursor.forEach(
                function(doc) {
                    console.log("pushing doc");
                    results.push(doc);
                    console.dir(doc);
                },
                function(err) {
                    client.close();
                }
            );
*/
            cursor.on('data', function(doc) {
              results.push(doc);
            });

            cursor.once('end', function() {
              db.close();
              resolve(results);              
            });            
          });
      });
    }

    compareLikes(sym_a, sym_b) {
        // Requires official Node.js MongoDB Driver 3.0.0+
        var mongodb = require("mongodb");

        var client = mongodb.MongoClient;
        var url = process.env.DB;
        return new Promise((resolve, reject) => {
          client.connect(url, function(err, client) {

              var db = client.db("fcc_sandbox");
              var collection = db.collection("stocks");

              var options = {
                  allowDiskUse: true
              };
/*
              var pipeline = [{
                      "$match": {
                          "ticker": {
                              "$in": [
                                  sym_a,
                                  sym_b
                              ]
                          }
                      }
                  },
                  {
                      "$group": {
                          "_id": {
                              "ticker": "$ticker"
                          },
                          "count": {
                              "$sum": 1
                          }
                      }
                  },
                  {
                      "$project": {
                          "_id": 0,
                          "ticker": "$_id.ticker",
                          "count": "$COUNT(*)"
                      }
                  }
              ];
*/
              var pipeline = [
                    {
                          "$match": {
                              "ticker": {
                                  "$in": [
                                      sym_a,
                                      sym_b
                                  ]
                              }
                          }
                      },
                      {
                          "$group": {
                              "_id": {
                                  "ticker": "$ticker"
                              },
                              "COUNT(*)": {
                                  "$sum": 1
                              }
                          }
                      }, 
                      {
                          "$project": {
                              "_id": 0,
                              "ticker": "$_id.ticker",
                              "COUNT(*)": "$COUNT(*)"
                          }
                      }
                  ];            
            

              var cursor = collection.aggregate(pipeline, options);
              var results = [];
  /*            cursor.forEach(
                  function(doc) {
                      console.log("pushing doc");
                      results.push(doc);
                      console.dir(doc);
                  },
                  function(err) {
                      client.close();
                  }
              );
  */
              cursor.on('data', function(doc) {
                results.push(doc);
              });

              cursor.once('end', function() {
                db.close();
                resolve(results);              
              });
              //console.log("here is dir results");
              //console.dir(results);
              //return results;
              // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

          });
      });
    }
}

module.exports = StockManager;