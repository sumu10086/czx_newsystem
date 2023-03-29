const db = require("./db")

const CategoriesSchema = new db.mongoose.Schema({
  id: {
    type: Number
  },
  title: {
    type: String
  },
  value: {
    type: String
  }
})

module.exports = db.mongoose.model("categories", CategoriesSchema)
