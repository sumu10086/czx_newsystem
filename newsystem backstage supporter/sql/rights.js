const db = require("./db")

const RightSchema = new db.mongoose.Schema({
  id: {
    type: Number
  },
  title: {
    type: String
  },
  key: {
    type: String
  },
  pagepermisson: {
    type: Number
  },
  grade: {
    type: Number
  }
})

module.exports = db.mongoose.model("rights", RightSchema)
