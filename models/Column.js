const mongoose = require('mongoose')
const { formatDate } = require('../core/util/util')

const schema = new mongoose.Schema({
  //分类名称
  name: {
    type: String,
    require: true,
  },
  //更新日期
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      return formatDate(new Date(val), 'yyyy-MM-dd hh:mm:ss')
    }
  },
  //文章列表
  aids: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref:'Article'
  }],
  uid: {
    type: mongoose.SchemaTypes.ObjectId
  }
})

schema.set('toJSON', { getters: true })
module.exports = mongoose.model('Column', schema)