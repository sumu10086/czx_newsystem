import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
//css
import style from "./news.module.scss"
// antd
import { Descriptions } from "antd"
// antd
import { RollbackOutlined, HeartFilled } from "@ant-design/icons"
export default function Detail() {
  const [detailNew, setdetailNew] = useState(null)
  const location = useLocation()
  const pathnameArr = location.pathname.split("/")
  let id = pathnameArr[pathnameArr.length - 1]
  useEffect(() => {
    axios.get(`/api/sys/getDetailNew?id=${id}`).then((res) => {
      let updateObj = {
        view: res.data.data.view + 1
      }
      axios
        .post(`/api/sys/updateNewsList`, { id, updateObj })
        .then((result) => {
          //   console.log(result.data.data)
          setdetailNew(result.data.data)
        })
    })
  }, [id])

  const time = (v = detailNew.createTime) => {
    return new Date(v).toLocaleString()
  }

  //   点击喜欢
  const [isLike, setisLike] = useState(false)
  const handleLike = (like) => {
    setisLike(like)
    let updateObj
    if (like) {
      updateObj = {
        star: detailNew.star + 1
      }
    } else {
      updateObj = {
        star: detailNew.star - 1
      }
    }
    axios.post(`/api/sys/updateNewsList`, { id, updateObj }).then((result) => {
      setdetailNew({
        ...detailNew,
        star: like ? detailNew.star + 1 : detailNew.star - 1
      })
    })
  }
  return (
    <div style={{ padding: "60px" }}>
      {detailNew && (
        <div>
          <div style={{ lineHeight: "50px", fontWeight: "bold" }}>
            <span>
              <RollbackOutlined
                style={{ fontSize: "32px" }}
                onClick={() => window.history.back(-1)}
              />
            </span>
            <span
              style={{ fontSize: "24px", color: "skyblue", marginLeft: "40px" }}
            >
              {detailNew.title}
            </span>
            <span style={{ opacity: "0.4", paddingLeft: "20px" }}>
              {detailNew.categorie?.title}
            </span>
            <span style={{ opacity: "0.4", paddingLeft: "20px" }}>
              <HeartFilled
                onClick={() => handleLike(!isLike)}
                style={{ color: isLike ? "red" : "" }}
              />
            </span>
          </div>
          <Descriptions>
            <Descriptions.Item label="创建者">
              {detailNew.author}
            </Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {detailNew.publishTime ? time(detailNew.publishTime) : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="区域">
              {detailNew.region}
            </Descriptions.Item>
            <Descriptions.Item label="访问数量">
              <span className={style.view}> {detailNew.view}</span>
            </Descriptions.Item>
            <Descriptions.Item label="点赞数量">
              <span className={style.star}> {detailNew.star}</span>
            </Descriptions.Item>
            <Descriptions.Item label="评论数量">0</Descriptions.Item>
            <Descriptions.Item label="内容">
              <div
                dangerouslySetInnerHTML={{ __html: detailNew.content }}
              ></div>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </div>
  )
}
