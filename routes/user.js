
/*
 * GET users listing.
 */

exports.list = function(req, res){
  console.log("respond with a resource");
  console.log(req.body);

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/UserRegistration');
var User = require('/Users/Ankur/Documents/Node-JS-Workspace/CMPE-297-Assignment-4/schema/registrationschema.js');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
})

var jsonData = JSON.stringify(req.body);

console.log("This is first Name: "+req.body.firstName);

var newUser = new User({ user: jsonData});
	
  newUser.save(function (err, newUser) {
  if (err) return console.error(err);
  });

  res.render('/');

};
