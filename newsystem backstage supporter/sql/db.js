const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/newsystemReactMongoDB")
// mongoose.connect('mongodb://user56486331:654321QWER!!@dds-2zedvd3muldp9awn-pub.mongodb.rds.aliyuncs.com:3717/?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true } )

mongoose.connection.on("connected", () => {
  console.log("我是mongodb 数据库 我连接了 连接成功!!!!!!!!!!!!!!!!!!!!!!!")
})

mongoose.connection.on("disconected", () => {
  console.log("disconected  数据库连接 断开")
})

mongoose.connection.on("error", () => {
  console.log("mongoose error")
})

module.exports.mongoose = mongoose
