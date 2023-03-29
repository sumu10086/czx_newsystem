const express = require("express")
const app = express()
const port = 8888

const fs = require("fs")
// npm i md5
const md5 = require("md5")
const bodyParser = require("body-parser")
app.use(bodyParser.json())
const jwt = require("jsonwebtoken")

const newDate = require("./sql/newDate")
const users = require("./sql/users")
const roles = require("./sql/roles")
const childrens = require("./sql/childrens")
const rights = require("./sql/rights")
const categories = require("./sql/categories")
const regions = require("./sql/regions")
const news = require("./sql/news")
var cors = require("cors")
const { ObjectId } = require("bson")

app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

//123   md5(123)  Jhi78   1 A向后推10位数 10J

const passwdCrypt = (req, res, next) => {
  console.log("passwdCrypt")
  console.log(req.body) //{ data: { password: 'abc123456', mobile: '18699991111' } }
  var password = req.body.password //123456

  req.body.passwdCrypted = md5(password) //grgrgergergergerg
  next()
}

const checkToken = function (req, res, next) {
  console.log("我进入校验token识别 这一步了")
  console.log("token")
  console.log(req.query)
  // 怎么样都可以传  这只是一种传递方式  能过来让服务器看见token就可以了
  var _token = req.query.token

  //这里要做 更合理的  各种情况的处理
  try {
    // jwt引擎 反推这个秘文  是否是我给你的  是的话 把你秘文变成你的 用户信息 还原
    let verify = jwt.verify(_token, jwt_secret)
    console.log("verify")
    console.log(verify)
    if (verify) {
      console.log("verify", verify)
      console.log("我进入verify里面了")
      req.body.user_info = verify
      console.log("req.body.user._info", req.body.user_info)
      next()
    }
  } catch (error) {
    res.send({
      code: "888",
      info: "你是不是没有我们的权限token乱来啊请重新登陆 "
    })
  }
}

app.get("/api/sys/userinfo", checkToken, (req, res) => {
  console.log("进来了/api/sys/user_info")

  console.log(req.body.user_info)
  res.send({
    code: "1000",
    info: "success",
    info2: req.body.user_info
  })
})
// //  先命中注册 然后不往后执行 要执行 passwdCrypt函数
// app.post("/api/zhuce", passwdCrypt, (req, res) => {
//   console.log("/api/zhuce我进来了")
//   var obj = {
//     mobile: req.body.mobile,
//     password: req.body.passwdCrypted,
//     roleState: req.body.roleState,
//     default: req.body.default,
//     region: req.body.region,
//     roleId: req.body.roleId,
//     roleImg: req.body.roleImg
//   }
//   users.findOne(
//     {
//       mobile: req.body.mobile
//     },
//     (err, data) => {
//       if (err) {
//         console.log(err)
//       }
//       // 如果查到了 有data代表注册过  让她继续停留在注册页面 别管他‘

//       if (data) {
//         res.send({
//           code: "409",
//           message: "已经注册过了"
//         })
//       } else {
//         // 如果没注册  开始注册 注册好了 进login页面 让他登录
//         user.insertMany(obj, (err, data) => {
//           if (err) {
//             console.log("err", err)
//           }
//           console.log(data)
//           //数据库有他就可以进入 /login
//           res.send({
//             code: "200",
//             msg: data,
//             message: "注册成功"
//           })
//         })
//       }
//     }
//   )
// })

const jwt_secret = "aaa"
app.post("/api/sys/login", passwdCrypt, async (req, res) => {
  console.log("/login")
  //这一步呼应 上面中间件处理的哪一步 req.body.passwdcrpyt = a
  let { mobile, passwdCrypted } = req.body
  console.log("mobile", mobile)
  console.log("passwdcrpty", passwdCrypted)
  let resultMobile = await users.find({
    mobile
  })
  if (resultMobile.length) {
    let user = await users.findOne({
      mobile,
      password: passwdCrypted
    })
    if (user) {
      let role = await roles.findOne({
        roleType: user.roleId
      })
      let userInfo = { user, role }
      res.send({
        code: "200",
        info: "登录成功",
        mobile: mobile,
        data: {
          // 转译用户信息的过程算法
          _token: jwt.sign(
            {
              // password: passwdCrypted,
              // mobile: user.mobile,
              userInfo
            },
            jwt_secret,
            {
              expiresIn: 1000 * 60 * 60 * 2
            }
          )
        }
      })
    } else {
      res.send({
        code: "4399",
        info: "账户密码有误"
      })
    }
  } else {
    res.send({
      code: "9999",
      info: "走开 你不是我的用户 "
    })
  }
})

// react 后台管理 API

// db.gameapp.aggregate([
//   {
//     $match: { name: "qysg10001" }
//   },
//   {
//     $lookup: {
//       from: "hosts",
//       localField: "host_id",
//       foreignField: "_id",
//       as: "host_info"
//     }
//   },
//   {
//     $unwind: {
//       path: "$host_info",
//       preserveNullAndEmptyArrays: true
//     }
//   }
// ])
// form：需要关联的表（hosts）
// localField：gameapp关联到hosts的键(字段)
// foreignField：hosts被关联到gameapp的localField的键(字段)
// as：对应的外键集合数据（可能存在一对多的情况）

// data
// app.get("/api/sys/getData", async (req, res) => {
//   // console.log("req.query", req.query)
//   let dataAll = await rights.aggregate([
// {
//   $match: { name: "qysg10001" }
// },
//     {
//       $lookup: {
//         from: "childrens",
//         localField: "id",
//         foreignField: "rightId",
//         as: "children"
//       }
//     },
//     {
//       $unwind: {
//         path: "$childrens",
//         preserveNullAndEmptyArrays: true
//       }
//     }
//   ])
//   console.log(dataAll)
//   res.send({ info: "success", data: dataAll, total: dataAll.length })
// })
// app.post("/api/sys/addData", async (req, res) => {
//   console.log("req.body", req.body)
//   var obj = req.body
//   await news.insertMany(obj)
//   let dataAll = await news.find({})
//   console.log(req.body)
//   res.send({ info: "success", data: dataAll, total: dataAll.length })
// })

/**
 * 动态路由数据  /api/sys/rightList ，  /api/sys/childrenList
 */
app.get("/api/sys/childrenList", async (req, res) => {
  let childrenList = await childrens.find({})
  res.send({ info: "success", data: childrenList, total: childrenList.length })
})
/**
 * 动态路由数据
 */

/**
 * 获取侧边栏数据 SideMenu 和 获取权限列表 RightList
 */
app.get("/api/sys/sideList", async (req, res) => {
  // console.log("req.query", req.query)
  let data = await rights.aggregate([
    // {
    //   $match: { name: "qysg10001" }
    // },
    {
      $lookup: {
        from: "childrens",
        localField: "id",
        foreignField: "rightId",
        as: "children"
      }
    }
    // {
    //   $unwind: {
    //     path: "$children",
    //     preserveNullAndEmptyArrays: true
    //   }
    // }
  ])
  // console.log(data)
  res.send({ info: "success", data: data, total: data.length })
})
/**
 * 获取侧边栏数据
 */

/**
 ***************************************************************************************************************************权限管理
 */
/**
 * 获取权限列表 rights  获取角色列表 roles
 */
// 获取权限列表 rights
app.get("/api/sys/rightList", async (req, res) => {
  let rightList = await rights.find({})
  res.send({ info: "success", data: rightList, total: rightList.length })
})
// 获取角色列表 roles
app.get("/api/sys/roleList", async (req, res) => {
  let roleList = await roles.find({})
  res.send({ info: "success", data: roleList, total: roleList.length })
})
/**
 * 获取权限列表
 */

/**
 * 删权限列表数据 rights 与 childrens  和  角色列表 roles
 */
// 删权限列表数据 rights 与 childrens
app.post("/api/sys/delRightList", async (req, res) => {
  let result = await rights.findByIdAndDelete(req.body.id)
  console.log(result)
  res.send({ info: "success", data: result })
})

app.post("/api/sys/delChildrens", async (req, res) => {
  let result = await childrens.findByIdAndDelete(req.body.id)
  console.log(result)
  res.send({ info: "success", data: result })
})
// 删角色列表 roles
app.post("/api/sys/delRoleList", async (req, res) => {
  let result = await roles.findByIdAndDelete(req.body.id)
  console.log(result)
  res.send({ info: "success", data: result })
})
/**
 * 删权限列表数据
 */

/**
 * 更新权限列表数据 rights 与 childrens 和  角色列表 roles
 */
// 更新权限列表数据 rights 与 childrens
app.post("/api/sys/updateRightList", async (req, res) => {
  let result = await rights.findByIdAndUpdate(req.body.id, {
    pagepermisson: req.body.pagepermisson
  })
  console.log(result)
  res.send({ info: "success", data: result })
})

app.post("/api/sys/updateChildrens", async (req, res) => {
  let result = await childrens.findByIdAndUpdate(req.body.id, {
    pagepermisson: req.body.pagepermisson
  })
  console.log(result)
  res.send({ info: "success", data: result })
})
// 更新角色列表 roles
app.post("/api/sys/updateRoleList", async (req, res) => {
  let result = await roles.findByIdAndUpdate(req.body.id, {
    rights: req.body.rights
  })
  console.log(result)
  res.send({ info: "success", data: result })
})
/**
 * 更新权限列表数据
 */
/**
 ***************************************************************************************************************************权限管理
 */

/**
 ***************************************************************************************************************************用户管理
 */
// 连表获取用户列表 users 连 roles
app.get("/api/sys/userList", async (req, res) => {
  let userList = await users.aggregate([
    {
      $lookup: {
        from: "roles",
        localField: "roleId",
        foreignField: "roleType",
        as: "roles"
      }
    },
    {
      $unwind: {
        path: "$roles",
        preserveNullAndEmptyArrays: true
      }
    }
  ])
  res.send({ info: "success", data: userList, total: userList.length })
})
// 连表获取用户列表 users 连 roles

// 删用户列表
app.post("/api/sys/delUserList", async (req, res) => {
  let result = await users.findByIdAndDelete(req.body.id)
  console.log(result)
  res.send({ info: "success", data: result })
})
// 修改用户列表
app.post("/api/sys/updateUserList", async (req, res) => {
  let obj = req.body.obj
  let result = await users.findByIdAndUpdate(req.body.id, obj)
  await news.findOneAndUpdate({ author: obj.mobile }, { roleImg: obj.roleImg })
  console.log(result)
  res.send({ info: "success", data: result })
})

// 新增表单
// 获取区域列表数据
app.get("/api/sys/regionList", async (req, res) => {
  let regionList = await regions.find()
  res.send({ info: "success", data: regionList })
})
// 获取角色列表数据
app.get("/api/sys/roleList", async (req, res) => {
  let roleList = await roles.find()
  res.send({ info: "success", data: roleList })
})
// 图片上传
// app.post("/api/sys/roleList", async (req, res) => {
//   let roleList = await users.insertMany()
//   res.send({ info: "success", data: roleList })
// })

// 添加用户
app.post("/api/sys/adduser", passwdCrypt, async (req, res) => {
  var obj = {
    mobile: req.body.mobile,
    password: req.body.passwdCrypted,
    roleState: req.body.roleState,
    default: req.body.default,
    region: req.body.region,
    roleId: req.body.roleId,
    roleMsg: req.body.roleMsg,
    roleImg: req.body.roleImg
  }
  // let obj = req.body
  let newuser = await users.find({
    mobile: req.body.mobile
  })
  console.log("newuser", newuser.length)
  if (newuser.length != 0) {
    res.send({
      info: "fail",
      msg: "已经注册过了"
    })
  } else {
    const result = await users.insertMany(obj)
    res.send({
      info: "success",
      msg: "注册成功",
      data: result
    })
  }
})
// 添加用户
// 新增表单

/**
 ***************************************************************************************************************************用户管理
 */

/**
 ***************************************************************************************************************************新闻管理
 */
// 获取新闻类型数据 /news-manage/add
app.get("/api/sys/categorieList", async (req, res) => {
  let categorieList = await categories.find()
  res.send({ info: "success", data: categorieList })
})
// 更改新闻类型数据 /news-manage/category
app.post("/api/sys/updateCategorieList", async (req, res) => {
  let categorieList = await categories.findByIdAndUpdate(
    req.body.id,
    req.body.updateObj
  )
  res.send({ info: "success", data: categorieList })
})
// 删除新闻类型数据 /news-manage/category
app.post("/api/sys/delCategorieList", async (req, res) => {
  let categorieList = await categories.findByIdAndDelete(req.body.id)
  res.send({ info: "success", data: categorieList })
})
// 存新闻数据 /news-manage/add
app.post("/api/sys/newsAdd", async (req, res) => {
  let newsObj = req.body.newsObj
  let newsList = await news.insertMany(newsObj)
  res.send({ info: "success", data: newsList, newsObj: newsObj })
})
// 取相关新闻数据至草稿箱 /news-manage/draft
app.get("/api/sys/newsDraft", async (req, res) => {
  let userInfo = {
    author: req.query.author,
    auditState: Number(req.query.auditState)
  }
  console.log(userInfo)
  let draftList = await news.aggregate([
    {
      $match: userInfo
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "id",
        as: "categorie"
      }
    },
    {
      $unwind: {
        path: "$categorie",
        preserveNullAndEmptyArrays: true
      }
    }
  ])
  res.send({ info: "success", data: draftList })
})
// 删草稿箱 /news-manage/draft   删新闻 /publish-manage/
app.post("/api/sys/delnewsDraftList", async (req, res) => {
  let result = await news.findByIdAndDelete(req.body.id)
  console.log(result)
  res.send({ info: "success", data: result })
})
// 更新新闻 /news-manage/draft ，/audit-manage/ , 游客路由/detail
app.post("/api/sys/updateNewsList", async (req, res) => {
  let result = await news.findByIdAndUpdate(req.body.id, req.body.updateObj)
  console.log(result)
  res.send({ info: "success", data: result })
})
// 取单个新闻详情页数据 /news-manage/preview/:id
app.get("/api/sys/getDetailNew", async (req, res) => {
  console.log(req.query)
  let newInfo = { _id: ObjectId(req.query.id) }
  let result = await news.aggregate([
    {
      $match: newInfo
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "id",
        as: "categorie"
      }
    },
    {
      $lookup: {
        from: "roles",
        localField: "roleId",
        foreignField: "roleType",
        as: "role"
      }
    },
    {
      $unwind: {
        path: "$categorie",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: "$role",
        preserveNullAndEmptyArrays: true
      }
    }
  ])
  res.send({ info: "success", data: result[0] })
})
/**
 ***************************************************************************************************************************新闻管理
 */

/**
 ***************************************************************************************************************************审核管理  发布管理
 */
// 获取审核列表数据 /audit-manage/list   /publish-manage/
app.get("/api/sys/auditList", async (req, res) => {
  const query = JSON.parse(req.query.queryStr)
  let result = await news.aggregate([
    {
      $match: query
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "id",
        as: "categorie"
      }
    },

    {
      $unwind: {
        path: "$categorie",
        preserveNullAndEmptyArrays: true
      }
    }
  ])
  res.send({ info: "success", data: result })
})

/**
 ***************************************************************************************************************************审核管理  发布管理
 */

/**
 ***************************************************************************************************************************更新 UserInfo
 */
app.post("/api/sys/updateUserInfo", async (req, res) => {
  let { id, roleImg } = req.body
  let user = await users.findByIdAndUpdate(id, { roleImg })
  let role = await roles.findOne({
    roleType: user.roleId
  })
  let userInfo = { user, role }
  res.send({ info: "success", data: userInfo })
})
/**
 ***************************************************************************************************************************更新 UserInfo
 */

/**
 ***************************************************************************************************************************  首页   游客路由
 */
// 获取首页新闻数据
app.get("/api/sys/newsList", async (req, res) => {
  const matchObj = JSON.parse(req.query.matchStr)
  const sortObj = JSON.parse(req.query.sortStr)
  let result = await news.aggregate([
    {
      $match: matchObj
    },
    {
      $sort: sortObj
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "id",
        as: "categorie"
      }
    },

    {
      $unwind: {
        path: "$categorie",
        preserveNullAndEmptyArrays: true
      }
    }
  ])
  res.send({ info: "success", data: result })
})
/**
 ***************************************************************************************************************************   首页   游客路由
 */
// 局部中间件  拦路虎
// app.post("/api/sys/login", passwdCrypt, async (req, res) => {
//   console.log("/login")
//   let { mobile, passwdCrypted } = req.body
//   console.log("req.body", req.body)
//   console.log("mobile", mobile)
//   console.log("passwdcrpty", passwdCrypted)
//   let result = await user.findOne({
//     mobile: mobile,
//     password: passwdCrypted
//   })
//   if (result) {
//     res.send({
//       code: "1000",
//       info: "success",
//       mobile: mobile,

//       data: {
//         // 转译用户信息的过程算法
//         _token: jwt.sign(
//           {
//             password: passwdCrypted,
//             mobile: result.mobile
//           },
//           jwt_secret,
//           {
//             expiresIn: 10 * 60 * 60 * 60 * 60
//           }
//         )
//       }
//     })
//   } else {
//     res.send({
//       code: "9999",
//       info: "走开 你不是我的用户 "
//     })
//   }
// })

//获取前台用户列表

// app.get("/api/sys/getcustomerlist", async (req, res) => {
//   console.log("getcustomerlist")
//   console.log("req.query", req.query)
//   const mobile = req.query.mobile
//   if (req.query.mobile) {
//     var userlist = await roles
//       .find({
//         mobile
//       })
//       .skip((req.query.pagenum - 1) * req.query.pagesize)
//       .limit(req.query.pagesize * 1)
//     var userlist2 = await roles.find({
//       mobile
//     })
//   } else {
//     var userlist = await roles
//       .find({})
//       .skip((req.query.pagenum - 1) * req.query.pagesize)
//       .limit(req.query.pagesize * 1)
//     var userlist2 = await roles.find({})
//   }
//   console.log(userlist)
//   res.send({
//     info: "success",
//     data: userlist,
//     total: userlist2.length
//   })
// })

/////////////////////////////////////////////////////////////////////////////////////////////////////
// 设置跨域
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  )

  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE,OPTIONS")
  // 千万不要网%%￥￥￥###
  // 千万不要网
  // 千万不要网
  next()
})

app.listen(port, () =>
  console.log(`Server is running at http://127.0.0.1:${port}!`)
)
