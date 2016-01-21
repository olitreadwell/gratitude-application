// server.js

// set up ======================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================

mongoose.connect('mongodb://gratitude-app-admin:A-super-secure-password!@ds047305.mongolab.com:47305/gratitude-app');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// define model ================================================

var Gratitude = mongoose.model('Gratitude', {
  text : String
});

// listen (start app with node server.js) ======================
var port = process.env.PORT || 8080;
app.listen(port);

// app.listen(8080);
console.log("App listening on port 8080");

// routes =======================================================

//++ api --------------------------------------------------------
//++ get all gratitudes
app.get('/api/gratitudes', function(request, response) {

  // use mongoose to get all gratitudes in the database
  Gratitude.find(function (error, gratitudes) {

    // if there is an error retrieving, send the error.
    //nothing after response.send(error) will execute.
    if (error)
      response.send(error)

    response.json(gratitudes); // return all gratitudes in JSON format
  });
})

// create gratitude and send back all gratitudes after creation
app.post('/api/gratitudes', function(request, response) {

  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var date = new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  // create a gratitude, information comes from AJAX request from Angular
  Gratitude.create({
    text : request.body.text + " (" + year + ' ' + monthNames[monthIndex] + ' ' + day + ")" ,
    removed : false
  }, function(error, gratitude) {
    if (error)
      response.send(error);

    // get and return all the gratitudes after you create another
    Gratitude.find(function(error, gratitudes) {
      if (error)
        response.send(error)

      response.json(gratitudes);
    });
  });
});

// delete a gratitude
app.delete('/api/gratitudes/:gratitude_id', function(request, response) {
  Gratitude.remove({
    _id : request.params.gratitude_id
  }, function(error, gratitude) {
    if (error)
      response.send(error);

    // get and return all the gratitudes after you delete
    Gratitude.find(function(error, gratitudes) {
      if (error)
        response.send(error)
      response.json(gratitudes);
    });
  });
});


// application ----------------------------------------------------
app.get('*', function(request, response) {
  // load the single view file
  // (angular will hindale the page changes on the front-end)
  response.sendfile('./public/index.html');
});
