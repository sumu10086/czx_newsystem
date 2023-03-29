const { any } = require("bluebird")
const db = require("./db")

const NewsSchema = new db.mongoose.Schema({
  title: {
    type: String
  },
  categoryId: {
    type: Number
  },
  content: {
    type: String
  },
  region: {
    type: String
  },
  author: {
    type: String
  },
  roleId: {
    type: Number
  },
  auditState: {
    type: Number
  },
  publishState: {
    type: Number
  },
  createTime: {
    type: Number
  },
  star: {
    type: Number
  },
  view: {
    type: Number
  },
  publishTime: {
    type: Number
  },
  roleImg: {
    type: String
  }
})

module.exports = db.mongoose.model("news", NewsSchema)
