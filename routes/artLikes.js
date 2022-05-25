let express = require('express');
let router = express.Router();
let Article = require('../models/Article')

//点赞文章
router.post('/:id', async (req, res, next) => {
  let _id = req.params.id
  console.log(_id)
  try {
    let result = await Article.findByIdAndUpdate(_id, {
      "$inc": {
        "like_num":1
      }
    })
    let likes = ++result.like_num
    res.send(200, {
      message: "点赞成功",
      data: {
        likes
      }
    })
  } catch (err) {
    next(err)
  }
});

module.exports = router;