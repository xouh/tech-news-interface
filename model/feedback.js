const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema({
  user_id: String,
  content: String
});

module.exports = model('feedback', feedbackSchema);