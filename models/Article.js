const mongoose = require('mongoose')
const { uploadURL } = require('../config')
const { formatDate } = require('../core/util/util')


let schema = new mongoose.Schema({
  //标题，必填
  title: {
    type: String,
    required: true,
    default: "默认标题" + new Date().toDateString()
  },
  //封面图
  cover: {
    type: String,
    default:`${uploadURL}article/article-cover.jpg`
  },
  //文章内容，必填
  content: {
    type: String,
    set(val) {
      try {
        val = decodeURIComponent(`${val}`).replace(/\"/g, "\'")
        return val
      } catch (err) {
        console.log(err)
        return val
      }
    },
    required: true
  },
  //更新日期
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      return formatDate(new Date(val),'yyyy-MM-dd hh:mm:ss')
    }
  },
  //点击数
  hit_num: {
    type: Number,
    default: 0
  },
  //评论数
  comment_num: {
    type: Number,
    default: 0
  },
  //点赞数
  like_num: {
    type: Number,
    default: 0
  },
  //作者
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  //评论
  comments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Comment'
    }
  ],
  //分类
  column: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Column',
    required: true
  }
})
schema.set('toJSON', { getters: true })
module.exports = mongoose.model('Article',schema)