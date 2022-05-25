const inflection = require('inflection')

module.exports = option => {
  return async (req, res, next) => {
    let modelName = inflection.classify(req.params.resource)
    req.Model = require(`../models/${modelName}`)
    next()
  }
}