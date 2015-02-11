var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
   user:String,
});

module.exports = mongoose.model('users', userSchema);