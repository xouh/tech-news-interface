// user 操作相关接口
const router = require('koa-router')();

const mongoose = require('mongoose');

const User = require('../../model/user');
const Article = require('../../model/article');


// 测试用数据
let { user_id, article_id } = require('./config');

router.prefix('/api');

router.post('/getUser', async function (ctx, next) {
  const { user_id = '' } = ctx.request.body;
  if (!user_id) {
    ctx.body = {
      code: 201,
      msg: "获取用户信息失败"
    }
  }
  let result = null;
  const user = await User.findById(user_id);

  ctx.body = {
    code: 200,
    message: "数据获取成功",
    data: user
  }

  await next()
});

// 获取关注作者列表
router.post('/getAuthors', async function (ctx, next) {

  let { user_id } = ctx?.request?.body;

  user_id = mongoose.Types.ObjectId(user_id);

  const { author_likes_ids } = await User.findById(user_id);

  const data = await User.aggregate()
    .addFields({
      is_like: { $in: ["$id", author_likes_ids] }
    }).match({
      is_like: true
    }).exec()

  ctx.body = {
    code: 200,
    msg: "数据请求成功",
    data
  }
  await next()
})

// 获取关注文章列表
router.post('/getFollows', async function (ctx, next){
  let { user_id } = ctx?.request?.body;

  const { article_likes_ids } = await User.findById(user_id);

  const data = await Article.aggregate()
    .addFields({
      is_like: { $in: ["$_id", article_likes_ids] }
    }).match({
      is_like: true
    }).exec()

  ctx.body = {
    code: 200,
    msg: "数据请求成功",
    data
  }
  await next()
})

router.post('/updateLabel', async function (ctx, next) {
  let { user_id, labels = [] } = ctx.request.body;

  if (labels.length) {
    labels.forEach((ele, index) => {
      labels[index] = mongoose.Types.ObjectId(ele)
    });
  }
  console.log(labels);
  // 必须等异步执行完后才能执行后续返回结果，不然有可能getLabel比updateLabel先执行
  // await User.update({ _id: user_id }, { $set: { label_ids: labels } })
  let user = await User.findById(user_id);
  await user.set({ label_ids: labels })
  await user.save()
  // User.findById(user_id, async function (err, user) {
  //   user.set({ label_ids: labels })
  //   await user.save()

  // })
  ctx.body = {
    code: 200,
    msg: "数据更新成功"
  }
  await next()
});

router.post('/updateThumbsup', async function (ctx, next) {
  let { user_id, article_id } = ctx.request.body;

  article_id = mongoose.Types.ObjectId(article_id);

  await User.findOneAndUpdate({ _id: user_id }, { $push: { thumbs_up_article_ids: article_id } });
  await Article.findOneAndUpdate({ _id: article_id }, { $inc: { thumbs_up_count: 1 } });

  ctx.body = {
    code: 200,
    msg: "数据更新成功"
  };

  await next();


});

// 文章收藏与取消收藏接口
router.post('/updateLike', async function (ctx, next) {

  let { user_id, article_id } = ctx.request.body;

  // let user_id = "624b1411f9ddc06fb37d0a8a",
  //   article_id = "624f2046fcf92e3eb5aa54ed";

  article_id = mongoose.Types.ObjectId(article_id);


  const { article_likes_ids } = await User.findById(user_id)


  const article_index = article_likes_ids.indexOf(article_id)
  if (article_index != -1) {
    article_likes_ids.splice(article_index);
  } else {
    article_likes_ids.push(article_id);
    // await User.findOneAndUpdate({ _id: user_id }, { $push: { article_likes_ids: article_id } });
  }

  await User.updateOne({ _id: user_id }, { $set: { article_likes_ids } });

  // 通过聚合获取数据，结果同 findById(user_id) ,user_id 是字符串
  // user_id = mongoose.Types.ObjectId(user_id);
  // let data = await User.aggregate([
  //   {
  //     $match: {
  //       _id: user_id
  //     }
  //   }, {
  //     $project: {
  //       article_likes_ids: 1
  //     }
  //   }
  // ])

  // console.log(data.indexOf('624f2046fcf92e3eb5aa54ee'));

  // await User.findOneAndUpdate({ _id: user_id }, { $push: { article_likes_ids: article_id } });
  // await Article.findOneAndUpdate({ _id: article_id }, { $inc: { collection_count: 1 } });

  ctx.body = {
    code: 200,
    msg: "数据更新成功"
  };

  await next();
});

// 作者关注信息接口
router.post('/updateAuthor', async function (ctx, next) {
  let { user_id, author_id } = ctx.request.body;

  // author_id = mongoose.Types.ObjectId(author_id);

  const { author_likes_ids } = await User.findById(user_id)

  const author_index = author_likes_ids.indexOf(author_id)

  if (author_index != -1) {
    author_likes_ids.splice(author_index);
  } else {
    author_likes_ids.push(author_id);
  }

  await User.updateOne({ _id: user_id }, { $set: { author_likes_ids } });

  ctx.body = {
    code: 200,
    msg: "数据更新成功"
  }
  await next()
})
module.exports = router

