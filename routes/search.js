let express = require('express');
let router = express.Router();
let Article = require('../models/Article')
const { pagination } = require('../core/util/util')

//关键字搜索文章
//http:127.0.0.1:3000/search?w=
router.get('/', async (req, res, next) => {
  let { w = '' } = req.query
  let regExp = new RegExp(w, 'i')
  let options = 'title',
    page = 1,
    size = 100,
    query = {
    $or: [
      { title: { $regex: regExp } },
      { content: { $regex: regExp } }
    ]
    },
    dis = 8

  try {
    let result = await pagination({ model: Article, query, options, page, size, dis })
    res.send(200, {
      message: "搜索成功",
      data: result
    })
  } catch (err) {
    next(err)
  }
});

module.exports = router;