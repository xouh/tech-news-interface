const { Schema, model } = require('mongoose');

let articleSchema = new Schema({
  id: String,
  title: String,
  browse_count: Number,
  collection_count: Number,
  comments_count: Number,
  author: { id: String, author_name: String, avatar: String, status: String },
  classify: String,
  thumbs_up_count: Number,
  create_time: String,
  content: String,
  cover: [String],
  mode: String
})

module.exports = model('Article', articleSchema, 'article')