'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
var mongoose    = require('mongoose');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

const DB = process.env.DB;
mongoose.connect(DB, { useNewUrlParser: true }); /*, function(err, client) {
}*/
mongoose.Promise = global.Promise; //We need this because Mongoose is async and its own promise library is deprecated...

//Don't for get app is our Express instance, already defined...


var db = mongoose.connection;                    
mongoose.connection
  .on('connected', () => {
    console.log(`Mongoose connection open on ${process.env.DB}`);
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

  //Routing for API 
  apiRoutes(app, db);  

  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
  

  //Start our server and tests!
  app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + process.env.PORT);
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          var error = e;
            console.log('Tests are not valid:');
            console.log(error);
        }
      }, 3500);
    }
  });
  


module.exports = app; //for testing


