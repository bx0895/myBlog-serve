let express = require('express');
let router = express.Router();
let User = require('../models/User')
let Article = require('../models/Article')
let Column = require('../models/Column')
const qs = require('qs')
const assert = require('http-assert')

//获取用户信息
router.get('/', async (req, res, next) => {
  let userId = req._id
  try {
    let userData = await User.findById(userId)
    userData = userData.toJSON()
    let articleCount = await Article.find({ author: userId }).count()
    let columnCount = await Column.find({ uid: userId }).count()
    userData.articleCount = articleCount
    userData.columnCount = columnCount
    res.send(200, {
      message: "搜索成功",
      data: userData
    })
  } catch (err) {
    next(err)
  }
});

//更新用户信息
router.put('/', async (req, res, next) => {
  let userId = req._id
  let putData = req.body
  let isPass = req.isPass
  try {
    assert(isPass,400,'无权操作')
    let userData = await User.findByIdAndUpdate(userId, putData, { runValidators: true, new: true })

    res.send(200, {
      message: "修改成功",
      data: userData
    })
  } catch (err) {
    next(err)
  }
});

module.exports = router;