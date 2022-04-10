const { Schema, model } = require('mongoose');

let userSchema = new Schema({
  id: String,
  author_name: String,
  avatar: String,
  status: String,
  fans_count: Number,
  professional: String,
  explain: String,
  gender: String,
  follow_count: Number,
  integral_count: String,
  article_likes_ids: Array,
  author_likes_ids: Array,
  thumbs_up_article_ids: Array,
  article_ids: Array,
  label_ids: Array
})

// let turboUserSchema = new Schema();

// turboUserSchema.add(userSchema).add({ label_ids: Array })

module.exports = model('User', userSchema, 'user')