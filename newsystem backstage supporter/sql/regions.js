const db = require("./db")

const RegionsSchema = new db.mongoose.Schema({
  title: {
    type: String
  },
  value: {
    type: String
  }
})

module.exports = db.mongoose.model("regions", RegionsSchema)
