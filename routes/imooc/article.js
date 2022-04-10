// article 操作相关接口
const router = require('koa-router')();

const mongoose = require('mongoose');

const Article = require('../../model/article');
const { $where } = require('../../model/user');
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

// 首页 搜索接口
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

// router.get('/getComments', async function (ctx, next) {
//   const articleID = ctx.request.body.articleID || "",
//     result = null

//   result = await Label.find({ articleID })
//   ctx.body = {
//     code: 200,
//     result: result.comments
//   }
// })

// router.get('/getFollow', async function (ctx, next) {
//   const articleID = ctx.request.body.articleID || "",
//     result = null

//   result = await Label.find({ articleID })
//   ctx.body = {
//     code: 200,
//     result: result.comments
//   }
// })
// label操作相关接口





module.exports = router