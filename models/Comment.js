const mongoose = require('mongoose')
const { formatDate } = require('../core/util/util')

let schema = new mongoose.Schema({
  //评论内容
  content: {
    type: String,
    require: true
  },
  //评论时间
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      return formatDate(new Date(val),'yyyy-MM-dd hh:mm:ss')
    }
  },
  //评论者id
  uid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:'User'
  },
  //评论文章id
  aid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:'Article'
  }
})

schema.set('toJSON', { getters: true })
module.exports = mongoose.model('Comment',schema)