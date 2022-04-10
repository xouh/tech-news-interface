// article 操作相关接口
const router = require('koa-router')();

const mongoose = require('mongoose');

const Article = require('../../model/article');
const comment = require('../../model/comment');

const User = require('../../model/user');


router.prefix('/api');

let { user_id, article_id } = require('./config');

// 首页文章列表接口
router.post('/getArticles', async function (ctx, next) {
  let { name, page = 1, pageSize = 5, user_id } = ctx?.request?.body;
  // const { name, page = 1, pageSize = 5 } = { name: "前端开发" };
  // userinfo = await User.findById(user_id);

  let matchObj = {}
  if (name !== "全部") {
    matchObj = { classify: name }
  }
  const article = await Article.find(matchObj)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .select("-content")

  ctx.body = {
    code: 200,
    msg: "数据请求成功",
    data: article
  }

  next()
})

// 首页搜索接口
router.post('/getSearchs', async function (ctx, next) {
  const { value } = ctx?.request?.body
  // const { value } = { value: "前端" }

  // 以下两种匹配方式都是可以的
  // const articles = await Article.find().where('title').regex(new RegExp(value, 'i'))
  //   .select("-content").exec()

  const articles = await Article.find({ 'title': new RegExp(value, 'i') }).select('-content')

  ctx.body = {
    code: 200,
    msg: "搜索成功",
    data: articles
  }

  next()
})

// 首页获取文章详情接口
router.post('/getDetail', async function (ctx, next) {
  let { article_id, user_id } = ctx?.request?.body;

  const user = await User.findById(user_id);

  article_id = mongoose.Types.ObjectId(article_id);
  console.log(user.article_likes_ids);
  const data = await Article.aggregate()
    .match({ _id: article_id })
    .addFields({
      is_author_like: { $in: ["$author.id", user.author_likes_ids] },
      is_like: { $in: ["$_id", user.article_likes_ids] },
      is_thumbs_up: { $in: ["$_id", user.thumbs_up_article_ids] }
    })
    .project({ comments: 0 }).exec();

  // const data = Article.aggregate().match({ classify: "后端开发" }).exec()

  ctx.body = {
    code: 200,
    msg: "数据请求成功",
    data: data[0]
  }

  await next();
})

router.post('/getComments', async function (ctx, next) {
  let { article_id } = ctx.request.body

  const article = await Article.findById(article_id),
    data = article.comments
  ctx.body = {
    code: 200,
    msg: "评论获取成功",
    data
  }
  await next();

})

// 文章页发布文章评论接口
router.post('/updateComment', async function (ctx, next) {
  let {
    user_id,
    article_id,
    content,
    comment_id = '',
    reply_id = '',
    is_reply = false
  } = ctx.request.body

  // let {
  //   content = "一键四连",
  //   comment_id = 'kxd46lew134',
  //   reply_id = '',
  //   is_reply = false
  // } = {}

  user_id = mongoose.Types.ObjectId(user_id)
  article_id = mongoose.Types.ObjectId(article_id)

  const user = await User.findById(user_id),
    article = await Article.findById(article_id),
    { comments } = article;

  const genID = (length) => {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
  }

  let commentObj = {
    comment_id: genID(5),
    comment_content: content,
    is_reply: is_reply,
    comment_create_time: new Date().getTime(),
    author: {
      author_id: user._id,
      author_name: user.author_name,
      avatar: user.avatar,
      professional: user.professional
    },
    replys: []
  }

  if (comment_id === '') {
    commentObj.replys = [];
    article.comments.unshift(commentObj);

  } else {

    let commentIndex = comments.findIndex(item =>
      item.comment_id === comment_id
    )
    let commentAuthor = '';
    if (is_reply) {
      // 子回复
      commentAuthor = comments[commentIndex].replys.find(item => item.comment_id === reply_id)
    } else {
      // 主回复
      commentAuthor = comments.find(item =>
        item.comment_id === comment_id
      )
    }

    commentAuthor = commentAuthor.author.author_name
    commentObj.to = commentAuthor

    article.comments[commentIndex].replys.unshift(commentObj)
  }

  console.log(article.comments[0].replys)
  await article.save()


  ctx.body = {
    code: 200,
    msg: "评论成功",
    commentObj
  }

  await next()
})

// router.get('/getComments', async function (ctx, next) {
//   const articleID = ctx.request.body.articleID || "",
//     result = null

//   result = await Label.find({ articleID })
//   ctx.body = {
//     code: 200,
//     result: result.comments
//   }
// })

module.exports = router