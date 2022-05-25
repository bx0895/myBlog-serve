const express = require('express');
const { getPublicKey } = require('../core/rsaControl')
const router = express.Router();
const Key = require('../models/Key')

/*GET getPubKey */
router.get('/', async function (req, res, next) {
  let result = await Key.findOne()
  res.json(200, {
    message: '查询成功',
    data:{
      key: result.content
    }
  })
});

module.exports = router;
