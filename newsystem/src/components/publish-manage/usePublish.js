import { useEffect, useState } from "react"
import axios from "axios"
import { notification } from "antd"
function usePublish(publishState) {
  const { user } = JSON.parse(localStorage.getItem("userInfo"))
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    let queryStr = JSON.stringify({
      author: user.mobile,
      publishState: publishState
    })
    axios.get(`/api/sys/auditList?queryStr=${queryStr}`).then((res) => {
      // console.log(res.data.data)
      setdataSource(res.data.data)
    })
  }, [publishState, user.mobile])

  const handlerPublish = (item) => {
    axios
      .post("/api/sys/updateNewsList", {
        id: item._id,
        updateObj: { publishState: 2, publishTime: Date.now() }
      })
      .then(() => {
        setdataSource(dataSource.filter((v) => v._id !== item._id))
        notification.success({
          message: `发布《${item.title}》成功`,
          description: "请到【发布管理/已发布】查看"
        })
      })
      .catch((err) => {
        notification.error({
          message: `发布《${item.title}》失败`,
          description: "请稍后再试！！"
        })
      })
  }
  const handlerSunset = (item) => {
    axios
      .post("/api/sys/updateNewsList", {
        id: item._id,
        updateObj: { publishState: 3 }
      })
      .then(() => {
        setdataSource(dataSource.filter((v) => v._id !== item._id))
        notification.success({
          message: `下线《${item.title}》成功`,
          description: "请到【发布管理/已下线】查看"
        })
      })
      .catch((err) => {
        notification.error({
          message: `下线《${item.title}》失败`,
          description: "请稍后再试！！"
        })
      })
  }
  const handlerDelete = (item) => {
    axios
      .post("/api/sys/delnewsDraftList", {
        id: item._id
      })
      .then(() => {
        setdataSource(dataSource.filter((v) => v._id !== item._id))
        notification.success({
          message: "删除通知",
          description: `删除《${item.title}》成功`
        })
      })
      .catch((err) => {
        notification.error({
          message: `删除《${item.title}》失败`,
          description: "请稍后再试！！"
        })
      })
  }

  return { dataSource, handlerPublish, handlerSunset, handlerDelete }
}

export default usePublish
