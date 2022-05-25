//更新文章的评论和分类的文章
const User = require('../models/User')
const Article = require('../models/Article')
const Comment = require('../models/Comment')
const Column = require('../models/Column')

module.exports = {
  "Comment": {
    "_refId": "aid",
    "_model": Article,
    "queryAct": "findByIdAndUpdate",
    "options": function(_id){
      return {
        "$push": {
          "comments": _id
        },
        "$inc": {
          "comment_num": 1
        }
      }
    }
  },
  Article: {
    "_refId": "column",
    "_model": Column,
    "queryAct": "findByIdAndUpdate",
    "options": function(_id){
      return {
        "$push": {
          "aids": _id
        }
      }
    }
  }
}