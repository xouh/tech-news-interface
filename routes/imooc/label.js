// label操作相关接口
const router = require('koa-router')();

const mongoose = require('mongoose')

const Label = require('../../model/label'),
  User = require('../../model/user');
const { $where } = require('../../model/user');

router.prefix('/api')

router.post('/getLabels', async function (ctx, next) {
  const { user_id, type } = ctx.request.body;
  // const { user_id, type } = { user_id: "624b1411f9ddc06fb37d0a89", type: "" };

  const user = await User.findById(user_id),
    user_label_ids = user?.label_ids;

  let matchObj = {}

  if (!user_id || !user) {
    ctx.body = {
      code: 201,
      msg: "未获取到用户，请登录后重试"
    };
    await next();
    return null;
  }

  if (type !== 'all' && user_label_ids.length != 0) {
    matchObj = { current: true }
  }
  // 单纯操作document，set schema中没有的字段是不行的，schema.virtual 貌似也行不通
  // 最后还是考虑用聚合实现
  // 需要注意的是，保存在user表中label_ids的id必须是ObjectId才能使用$in匹配

  // const labels = await Label.aggregate([{
  //   $addFields: {
  //     current: { $in: ["$_id", user_label_ids] }
  //   }
  // }]).match(matchObj).exec()

  const labels = await Label.aggregate()
    .addFields({
      current: { $in: ["$_id", user_label_ids] }
    })
    .match(matchObj)
    .exec()

  ctx.body = {
    code: 0,
    msg: "数据请求成功",
    data: labels
  }

  await next()
})


module.exports = router
