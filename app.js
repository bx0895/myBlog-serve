const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const mongoose = require('./plugins/db')
const recourceMiddleware = require('./middleware/resource')
const { maxFileSize } = require('./config')
const expressJwt = require('express-jwt')
const { getPublicKeySync } = require('./core/rsaControl')
const User = require('./models/User')


const adminRouter = require('./routes/admin');
const pubKeyRouter = require('./routes/getPubKey');
const busRouter = require('./routes/bus')
const uploadRouter = require('./routes/upload')
const artLikesRouter = require('./routes/artLikes')
const searchRouter = require('./routes/search')
const userRouter = require('./routes/user')

const app = express();

app.use(cors({
  "origin": true, //true 设置为 req.origin.url
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //容许跨域的请求方式
  "allowedHeaders": "x-requested-with,Authorization,token, content-type", //跨域请求头
  "preflightContinue": false, // 是否通过next() 传递options请求 给后续中间件 
  "maxAge": 1728000, //options预验结果缓存时间 20天
  "credentials": true, //携带cookie跨域
  "optionsSuccessStatus": 200 //options 请求返回状态码
}))

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(expressJwt({
  secret: getPublicKeySync(),
  algorithms: ["RS256"],
  isRevoked: async (req, payload, next) => {
    let { _id } = payload
    req._id = _id
    req.isPass = true
    try {
      let result = await User.findById(_id)
      if (!result) {
        req.isPass = false
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}).unless({
  path: [
    { url: /\/api\/rest/, methods: ['GET'] },
    { url: '/admin/login' },
    { url: '/admin/register' },
    { url: '/keys' },
    { url: '/articles/search' },
    { url: '/articles/likes' },
    // { url: '/article' }
  ]
}))


//数据库操作
app.use('/api/rest/:resource', recourceMiddleware(), busRouter)
//登录、注册
app.use('/admin', adminRouter)
//获取公钥
app.use('/keys', pubKeyRouter)
//上传文件
app.use('/upload', uploadRouter)
//点赞文章
app.use('/articles/likes', artLikesRouter)
//搜索文章
app.use('/articles/search', searchRouter)

app.use('/user', userRouter)

app.use('/index', (req, res, next) => {
  if (req.isPass) {
    res.send(200, {
      message:'ok'
    })
  } else {
    res.send(401, {
      message: '请先登录'
    })
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const ERROR_CODE_MAP = {
  'LIMIT_FILE_SIZE': `文件大小不得超过 ${maxFileSize} bytes`
}

const ERROR_STATUS_MAP = {
  '401': `无操作权限，请先登录`
}

const QUE_MAP = {
  "username": "用户名",
  "password": "密码",
  "nickname": "昵称",
  "email": "邮箱",
  "avatar": "头像"
} 


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page

  if (err.message.indexOf('duplicate key error') !== -1) {
    console.log(err.keyPattern)
    let repeatKey = Object.entries(err.keyPattern)?.map(([key, value]) => {
      return `${QUE_MAP?.[key]}不能重复`
    })[0]
    err.status = 422
    err.message = repeatKey
  }
  console.log(err)
  if (err.errors) {
    let paramErrors = Object.entries(err.errors).map(([key, val]) => {
    return `${val.message} `
    }).join(',')
    err.status = 422
    err.message = paramErrors
  }


  if (err.code in ERROR_CODE_MAP) {
    err.status = 422
    err.message = ERROR_CODE_MAP[err.code]
  }
  if (err.status in ERROR_STATUS_MAP) {
    err.message = ERROR_STATUS_MAP[err.status]
  }

  res.status(err.status || 500).send({
    code: err.status,
    message: err.message
  });
  // res.render('error');
});

module.exports = app;
