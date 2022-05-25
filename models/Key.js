const mongoose = require('mongoose')
const { formatDate } = require('../core/util/util')

const schema = new mongoose.Schema({
  //公钥内容
  content: {
    type: String,
    required: true
  },
  //更新日期
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      return formatDate(new Date(val), 'yyyy-MM-dd')
    }
  }
})

schema.set('toJSON', { getters: true })
module.exports = mongoose.model('Key', schema)