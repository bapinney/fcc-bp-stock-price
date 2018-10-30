/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
    
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          
          //complete this one too
         assert.equal(!Number.isNaN(Number(res.body.price)), true, "Stock price is a number");
         done();
        });
      }); 
      
      var likesBefore;
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'AAPL', like:'true'})
        .end(function(err, res) {
          console.log("Here is res after like");
          console.dir(res);
          likesBefore = res.body.likes;
          assert.isAtLeast(likesBefore, 1, "Liked stock has at least 1 like");
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'AAPL', like:'true'})
        .end(function(err, res) {
          console.log("Here is res after like");
          console.dir(res);
          assert.equal(res.body.likes, likesBefore, "Likes aren't double counted");
          done();
        });
      });
      
      test('2 stocks', function(done) {
        //stock=CSIQ&stock=MSFT
        chai.request(server)
        .get('/api/stock-prices')
        .query("stock=CSIQ&stock=MSFT")
        .end(function(err, res) {
          console.log("Here is res after 2 query");
          console.dir(res);
          assert.equal(res.body.stockData.length, 2, "2 stocks");
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query("stock=CSIQ&stock=MSFT")
        .end(function(err, res) {
          console.log("Here is res after 2 like query");
          console.dir(res);
          assert.equal(res.body.stockData[0].hasOwnProperty("rel_likes"), true, "Has relative likes");
          assert.equal(typeof res.body.stockData[0].likes,"number","Relative likes is a number");
          done();
        });
      });
      
     
    });

});
