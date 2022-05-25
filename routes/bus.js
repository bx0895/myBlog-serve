const express = require('express')
const router = express.Router()
const { pagination } = require('../core/util/util')
const POPULATE_MAP = require('../plugins/POPULATE_MAP')
const POP_POST_MAP = require('../plugins/POP_POST_MAP')
const POP_GET_MAP = require('../plugins/POP_GET_MAP')
const POP_PUT_MAP = require('../plugins/POP_PUT_MAP')
const RESOURCE_POST_MAP = require('../plugins/RESOURCE_POST_MAP')
const assert = require('http-assert')
const User = require('../models/User')
const Article = require('../models/Article')
const Comment = require('../models/Comment')
const Column = require('../models/Column')
const mongoose = require('../plugins/db')
const createError = require('http-errors')
const qs = require('qs')

//创建资源
router.post('/', async (req, res, next) => {
  try {
    let modelName = req.Model.modelName
    let body = req.body

    if (modelName in RESOURCE_POST_MAP) {
      body = RESOURCE_POST_MAP[modelName]['body'](body,req._id)
    }

    let result = await req.Model.create(body)

    if (modelName in POP_POST_MAP) {
      let item = POP_POST_MAP[modelName]
      let { _refId, _model, queryAct, options } = item
      let _id = result._id
      let refId = result?.[_refId]
      assert(refId, 422, `${_refId}必填`)
      await _model[queryAct](refId, options(_id))
    }
    res.send(200, {
      message: '提交成功',
      data: {
        id: result._id
      }

    })
  } catch (err) {
    next(err || createError(400,'添加失败'))
  }
})

//获取资源
router.get('/', async (req, res,next) => {
  let modelName = req.Model.modelName
  let { options = {}, page = 1, size = 100, query = {}, dis = 8, populates = {} } = req.query
  query = qs.parse(query)
  //关键字查询文章
  if (query.q) {
    let regExp = new RegExp(query.q,'i')
    query = {
      $or: [
        { title: { $regex: regExp } },
        { content: { $regex: regExp } }
      ]
    }
  }

  try {
    if (modelName in POPULATE_MAP) {
      populates = POPULATE_MAP[modelName]
    }
    let result = await pagination({ model: req.Model, query, options, populates,page, size, dis })
    res.send(200, {
      meaasge: '查询成功',
      data: {
        ...result
      }
    })
  } catch (err) {
    console.log(err)
    next(createError(422,'查询信息错误'))
  } 
  
})

//根据ID获取资源
router.get('/:id', async (req, res) => {
  let modelName = req.Model.modelName
  let _id = req.params.id
  try {
    let result = req.Model.findById(_id)
    if (modelName in POPULATE_MAP) {
      let populates = POPULATE_MAP[modelName]
        result = result.populate(populates)
        result = await result.exec()
        res.send(200, {
          message: "查询成功",
          data: {
            ...result
          }
        })
    }
    //点击文章后点击量增一
    if (modelName in POP_GET_MAP) {
      let { queryAct, options } = POP_GET_MAP[modelName]
      await req.Model[queryAct](_id, options())
    }

  } catch (err) {
    console.log(err)
  }

})

//根据id更新资源
router.put('/:id', async (req, res, next) => {
  let putDate = req.body
  let isPass = req.isPass
  let id = req.params.id //资源id
  let userId = req._id //用户id
  let modelName = req.Model.modelName
  console.log(userId,isPass)
  try {
    let { revisable, authField } = POP_PUT_MAP[modelName]
    let isValidate = (modelName in POP_PUT_MAP) && isPass
    assert(isValidate, 400, "无权修改")
    let data = await req.Model.findById(id)
    assert(data, 404, "资源不存在")
    assert.equal(userId,data?.[authField],400,"无操作权限")
    let updateDate = Object.entries(putDate).filter(([key, value]) => {
      return revisable.includes(key)
    })
    isValidate = updateDate.length !== 0
    assert(isValidate, 400, '修改失败')
    updateDate = Object.fromEntries(updateDate)
    updateDate['date'] = new Date().toISOString()
    await req.Model.findByIdAndUpdate(id, updateDate)
    res.send(200, {
      message: "修改成功",
    })
  } catch (err) {
    console.log(err.message)
    next(err)
  }
})

//根据id删除资源
router.delete('/:id', async (req, res, next) => {
  try {
    let query = req.query
    query = qs.parse(query)
    await req.Model.findOneAndRemove(query)
    res.send(200, {
      message: '删除成功',
    })
  } catch (err) {
    console.log(err)
  }

})



module.exports = router;