const { encrypt, decrypt } = require('../core/util/util.js')
const mongoose = require('mongoose')

let schema = new mongoose.Schema({
  //用户名，唯一，必填，校验
  username: {
    type: String,
    unique: true,
    index: true,
    required: [true, '用户必填'],
    validate: {
      validator(val) {
        return /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,8}$/.test(val)
      },
      message: "用户名必须为 数字+字母 6-8位"
    }
  },
  //密码
  password: {
    type: String,
    unique: true,
    required: [true, '密码必填'],
    select: false,
    validate: {
      validator(val) {
        return val !== '密码格式不正确'
      },
      message: "密码必须为 数字+大小写字母 8-12位"
    },
    //加密处理
    set(val) {
      let isValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/.test(decrypt(val))
      if (isValidator) {
        return encrypt(val)
      }
      return '密码格式不正确'
    }
  },
  email: {
    type: String,
    required: [true, '邮箱必填'],
    validate: {
      validator(val) {
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val)
      },
      message: "请输入合法邮箱地址"
    },
    unique: true
  },
  //头像
  avatar: {
    type: String,
    default: "http://127.0.0.1:3000/user/avatar.jpg"
  },
  //昵称
  nickname: {
    type: String,
    validate: {
      validator: function (val) {
        return /^[0-9a-zA-Z\u0391-\uFFE5]{1,8}$/.test(val)
      },
      message: "昵称可包含 数字/英文/汉字 1-8位"
    },
    default: '用户' + ~~(Math.random() * 1000)
  },
  signature: {
    type: String,
    default: '这个人很懒，什么都没写'
  }
})
let User = mongoose.model('User',schema)
module.exports = User