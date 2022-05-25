const express = require('express');
const router = express.Router();
const { sendToken } = require('../core/sendToken')
const { encrypt, decrypt } = require('../core/util/util')
const assert = require('http-assert')
const User = require('../models/User')

const CLASSIFY = {
  "login": "login",
  "register": "register"
}

/* POST register/login listing. */
router.post('/:classify', async function (req, res, next) {
  let { username, password } = req.body
  let { classify } = req.params
  let isClassify = classify in CLASSIFY
  assert(isClassify, 400, "请求错误")

  let user
  try {
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0) {
      assert(false, 422, '用户名或密码不能为空')
    }
    if (classify === 'login') {
    user = await User.findOne({ username }).select('+password')
      assert(user, 422, '用户不存在')
    assert.equal(decrypt(password), decrypt(decrypt(user.password)), 422, '用户密码错误')
    }

    if (classify === 'register') {
       user = await User.create(req.body)
    }
    let token = await sendToken(user)
    res.send(200,  {
        message: '登录成功',
        data: {
          userId: user._id,
          token: token
        }
    })

  } catch (err) {
     next(err)
   }
});

module.exports = router;