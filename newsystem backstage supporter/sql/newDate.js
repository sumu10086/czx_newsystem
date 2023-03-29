const db = require("./db")

const UserSchema = new db.mongoose.Schema({
  users: {
    type: Array
  },
  roles: {
    type: Array
  },
  children: {
    type: Array
  },
  rights: {
    type: Array
  },
  categories: {
    type: Array
  },
  regions: {
    type: Array
  },
  news: {
    type: Array
  }
})

module.exports = db.mongoose.model("newdates", UserSchema)
