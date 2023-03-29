const db = require("./db")

const RoleNameSchema = new db.mongoose.Schema({
  id: {
    type: Number
  },
  roleName: {
    type: String
  },
  roleType: {
    type: Number
  },
  rights: {
    type: Array
  }
})

module.exports = db.mongoose.model("roles", RoleNameSchema)
