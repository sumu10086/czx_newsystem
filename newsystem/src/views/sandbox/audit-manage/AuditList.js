import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// css

// antd
import {
  SmileOutlined,
  FrownOutlined,
  RadarChartOutlined,
  QqOutlined
} from "@ant-design/icons"
import { Button, Table, notification, Tag } from "antd"

export default function AuditList() {
  const { user } = JSON.parse(localStorage.getItem("userInfo"))
  const [auditList, setauditList] = useState([])

  useEffect(() => {
    let queryStr = JSON.stringify({
      author: user.mobile,
      auditState: { $ne: 0 },
      publishState: { $lte: 1 }
    })
    axios.get(`/api/sys/auditList?queryStr=${queryStr}`).then((res) => {
      // console.log(res.data.data)
      setauditList(res.data.data)
    })
  }, [user.mobile])

  const [api, contextHolder] = notification.useNotification()
  var openNotification = (
    iconType = 1,
    message = "message",
    description = "页面已更新~~"
  ) => {
    let icon = ""
    switch (iconType) {
      case 1:
        icon = (
          <SmileOutlined
            style={{
              color: "#108ee9"
            }}
          />
        )
        break
      case 2:
        icon = (
          <FrownOutlined
            style={{
              color: "red"
            }}
          />
        )
        break
      default:
        icon = (
          <RadarChartOutlined
            spin
            style={{
              color: "#c8f6d8"
            }}
          />
        )
        break
    }
    api.open({
      icon: icon,
      message: message,
      description: description,
      placement: "bottomRight"
    })
  }

  //跳转详情页
  const navigate = useNavigate()

  // Table配置
  const columns = [
    {
      title: "新闻标题",
      key: "_id",
      align: "center",
      render: (item) => (
        <div>
          <a
            style={{ color: "orangered", fontWeight: "bold" }}
            href={`#/news-manage/preview/${item._id}`}
          >
            {" "}
            {item.title}
          </a>
        </div>
      )
    },
    {
      title: "作者",
      key: "author",
      dataIndex: "author",
      align: "center",
      render: (author, item) => {
        return (
          <div>
            <QqOutlined style={{ color: "skyblue" }} />
            <a href={`#/news-manage/preview/${item._id}`}> {author}</a>
          </div>
        )
      }
    },
    {
      title: "新闻分类",
      key: "_id",
      dataIndex: "categorie",
      align: "center",
      render: (categorie) => categorie?.title
    },
    {
      title: "审核状态",
      key: "_id",
      dataIndex: "auditState",
      align: "center",
      render: (auditState) => {
        const colorList = ["black", "orangered", "green", "red"]
        const auditListText = ["未审核", "审核中", "已通过", "未通过"]
        return (
          <Tag color={colorList[auditState]}>{auditListText[auditState]}</Tag>
        )
      }
    },
    {
      title: "操作",
      key: "_id",
      align: "center",
      render: (item) => (
        <div>
          {item.auditState === 1 && (
            <Button
              type="dashed"
              danger
              shape="round"
              size="large"
              onClick={() => handlerReset(item)}
            >
              撤销
            </Button>
          )}
          {item.auditState === 2 && (
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={() => handlerPublish(item)}
            >
              发布
            </Button>
          )}
          {item.auditState === 3 && (
            <Button
              type="link"
              size="large"
              onClick={() => handlerUpdate(item)}
            >
              更新
            </Button>
          )}
        </div>
      )
    }
  ]

  // 重置按钮回草稿箱
  const handlerReset = (item) => {
    axios
      .post("/api/sys/updateNewsList", {
        id: item._id,
        updateObj: { auditState: 0 }
      })
      .then(() => {
        setauditList(auditList.filter((v) => v._id !== item._id))
        openNotification(1, `已撤回《${item.title}》至草稿箱`)
      })
      .catch((err) => {
        openNotification(2, `撤回《${item.title}》失败`, "请稍后再试！！")
      })
  }
  // 更新按钮跳回更新页面
  const handlerUpdate = (item) => {
    navigate(`/news-manage/update/${item._id}`)
  }
  //新闻发布按钮
  const handlerPublish = (item) => {
    axios
      .post("/api/sys/updateNewsList", {
        id: item._id,
        updateObj: { publishState: 2, publishTime: Date.now() }
      })
      .then(() => {
        setauditList(auditList.filter((v) => v._id !== item._id))
        openNotification(
          1,
          `发布《${item.title}》成功`,
          "请到【发布管理/已发布】查看"
        )
        navigate(`/publish-manage/published`)
      })
      .catch((err) => {
        openNotification(2, `发布《${item.title}》失败`, "请稍后再试！！")
      })
  }
  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={auditList}
        rowKey={(item) => item._id}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 30],
          defaultPageSize: 10,
          total: auditList.length,
          showTotal: (total, range) => `${range[0]}-${range[1]}  总${total}条`
        }}
      />
    </div>
  )
}
