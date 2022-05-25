const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/blog')

let db = mongoose.connection
db.on('error',(err) => {
  console.log(err)
})
db.on('open',(err) => {
  console.log('mongodb://127.0.0.1:27017/blog 已连接')
})

module.exports = {
  mongoose
}