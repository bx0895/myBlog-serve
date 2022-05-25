module.exports = {
  'Article': {
    'body': function (data, _id) {
      return {
        ...data,
        author:_id
      }
    }
  },
  'Column': {
    'body': function (data, _id) {
      return {
        ...data,
        uid:_id
      }
    }
  },
  'Comment': {
    'body': function (data, _id) {
      return {
        ...data,
        uid:_id
      }
    }
  }
}