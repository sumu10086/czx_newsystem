const db = require("./db")

const UserSchema = new db.mongoose.Schema({
  id: {
    type: Number
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String
    // required: true
  },
  roleState: {
    type: Boolean
    // default: false
  },
  default: {
    type: Boolean
    // default: false
  },
  region: {
    type: String
  },
  roleId: {
    type: Number
  },
  roleImg: {
    type: String
  },
  roleMsg: {
    type: String
  }
})

module.exports = db.mongoose.model("users", UserSchema)
