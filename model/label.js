const { Schema, model } = require('mongoose');
const User = require('./user');

let labelSchema = new Schema({
  name: String,
  user: Array
})

module.exports = model('Label', labelSchema, 'label')