// 有点不好设计，先把评论数据放到article model中
const { Schema, model } = require('mongoose');

const userCSchmea = new Schema({
  author_id: Schema.Types.ObjectId,
  author_name: String,
  avatar: { type: String, default: "https://avatars.githubusercontent.com/u/70921216" },
  professional: { type: String, default: "外星人" }
})

const commentSchema = new Schema({
  article_id: Schema.Types.ObjectId,
  comment_id: String,
  comment_content: String,
  is_reply: Boolean,
  comment_create_time: { type: Date, default: Date.now },
  author: userCSchmea,
  replys: [new Schema(this)],
  to: { type: String, default: "" }
})

module.exports = model('Comment', commentSchema, 'comment')