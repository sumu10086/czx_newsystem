const db = require("./db")

const ChildrenSchema = new db.mongoose.Schema({
  id: {
    type: Number
  },
  title: {
    type: String
  },
  rightId: {
    type: Number
  },
  key: {
    type: String
  },
  pagepermisson: {
    type: Number
  },
  routepermisson: {
    type: Number
  },
  grade: {
    type: Number
  }
})

module.exports = db.mongoose.model("childrens", ChildrenSchema)
