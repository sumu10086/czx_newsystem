import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
// antd
import { Descriptions } from "antd"
// antd
import { LeftCircleTwoTone } from "@ant-design/icons"
export default function NewsPreview() {
  const [detailNew, setdetailNew] = useState(null)
  const location = useLocation()
  useEffect(() => {
    const pathnameArr = location.pathname.split("/")
    let id = pathnameArr[pathnameArr.length - 1]
    axios.get(`/api/sys/getDetailNew?id=${id}`).then((res) => {
      // console.log(res.data.data)
      setdetailNew(res.data.data)
    })
  }, [location.pathname])
  const time = (v = detailNew.createTime) => {
    return new Date(v).toLocaleString()
  }
  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const publishList = ["未发布", "待发布", "已上线", "已下线"]
  const colorList = ["skyblue", "orangered", "green", "red"]
  return (
    <div>
      {detailNew && (
        <div>
          <div style={{ lineHeight: "50px", fontWeight: "bold" }}>
            <span>
              <LeftCircleTwoTone
                style={{ fontSize: "40px" }}
                onClick={() => window.history.back(-1)}
              />
            </span>
            <span
              style={{ fontSize: "24px", color: "orange", marginLeft: "30px" }}
            >
              {detailNew.title}
            </span>
            <span style={{ opacity: "0.4", paddingLeft: "40px" }}>
              {detailNew.categorie?.title}
            </span>
          </div>
          <Descriptions>
            <Descriptions.Item label="创建者">
              {detailNew.author}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{time()}</Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {detailNew.publishTime ? time(detailNew.publishTime) : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="区域">
              {detailNew.region}
            </Descriptions.Item>
            <Descriptions.Item
              label="审核状态"
              contentStyle={{ color: colorList[detailNew.auditState] }}
            >
              {auditList[detailNew.auditState]}
            </Descriptions.Item>
            <Descriptions.Item
              label="发布状态"
              contentStyle={{ color: colorList[detailNew.publishState] }}
            >
              {publishList[detailNew.publishState]}
            </Descriptions.Item>
            <Descriptions.Item label="访问数量">
              {detailNew.view}
            </Descriptions.Item>
            <Descriptions.Item label="点赞数量">
              {detailNew.star}
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
