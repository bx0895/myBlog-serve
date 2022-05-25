module.exports = {
  "Article": {
    "revisable": ["title", "cover", "content"],
    "authField": "author"
  },
  "User": {
    "revisable": ["password", "nickname", "avatar", "email"],
    "authField": "_id"
  },
  "Comment": {
    "revisable": ["content"],
    "authField": "uid"
  },
  "Column": {
    "revisable": ["name",],
    "authField": "uid"
  }
}