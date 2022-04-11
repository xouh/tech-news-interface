const { Schema, model } = require('mongoose');

const userCSchmma = new Schema({
  author_id: Schema.Types.ObjectId,
  author_name: String,
  avatar: { type: String, default: "https://avatars.githubusercontent.com/u/70921216" },
  professional: { type: String, default: "外星人" }
})

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
  mode: String,
  comments: [{
    comment_id: String,
    comment_content: String,
    is_reply: Boolean,
    comment_create_time: Number,
    author: userCSchmma,
    replys: []
  }]
})

module.exports = model('Article', articleSchema, 'article')