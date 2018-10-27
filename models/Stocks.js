var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchema = new Schema({
  ticker: { type: String, required: true },
  ip: { type: String, required: true }
});

stockSchema.index({
  ticker: 1,
  ip: 1,
}, {
  unique: true
});


var Stocks = mongoose.model('Stocks', stockSchema);
module.exports = Stocks;
