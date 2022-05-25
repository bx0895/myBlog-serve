//获取文章时点击数加一
const Article = require('../models/Article')

module.exports = {
  "Article": {
    "queryAct": "findByIdAndUpdate",
    "options": function () {
      return {
        "$inc": {
          "hit_num": 1
        }
      }
    }
  }
}