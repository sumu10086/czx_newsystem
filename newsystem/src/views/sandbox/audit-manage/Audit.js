import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// antd
// antd
import {
  QqOutlined,
  SmileOutlined,
  FrownOutlined,
  RadarChartOutlined
} from "@ant-design/icons"
import { Button, Table, notification } from "antd"
export default function Audit() {
  const [dataSource, setdataSource] = useState([])
  const { user } = JSON.parse(localStorage.getItem("userInfo"))
  useEffect(() => {
    let queryStr = JSON.stringify({
      auditState: 1
    })
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor"
    }
    axios.get(`/api/sys/auditList?queryStr=${queryStr}`).then((res) => {
      let list = res.data.data
      setdataSource(
        roleObj[user.roleId] === "superadmin"
          ? list
          : [
              ...list.filter((v) => v.author === user.mobile),
              ...list.filter(
                (v) =>
                  v.region === user.region && roleObj[v.roleId] === "editor"
              )
            ]
      )
      // console.log(res.data.data)
    })
  }, [user.mobile, user.region, user.roleId])
  // 通知
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
      description: description
    })
  }
  // 通知

  //跳转详情页
  const navigate = useNavigate()

  // 操作
  const handlerEdit = (type, item) => {
    //  type为 1 通过 0 驳回
    setdataSource(dataSource.filter((v) => v._id !== item._id))

    let obj = {
      id: item._id,
      updateObj: {
        auditState: type ? 2 : 3,
        publishState: type ? 1 : 0
      }
    }
    let iconType = type ? 1 : 3
    let message = type ? "新闻通过" : "新闻驳回"
    let description = type
      ? "请到【审核管理/审核列表】【发布管理/待发布】中查看或发布 "
      : "请到【审核管理/审核列表】中查看"
    axios.post("/api/sys/updateNewsList", obj).then((res) => {
      console.log(res.data.data)
      openNotification(iconType, message, description)
    })
  }

  // Table配置
  const columns = [
    {
      title: "新闻标题",
      key: "_id",
      align: "center",
      render: (item) => (
        <span onClick={() => navigate(`/news-manage/preview/${item._id}`)}>
          {item.title}
        </span>
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
      title: "操作",
      key: "_id",
      align: "center",
      render: (item) => (
        <div>
          {item.auditState === 1 && (
            <Button
              type="primary"
              danger
              shape="round"
              size="large"
              onClick={() => handlerEdit(0, item)}
            >
              驳回
            </Button>
          )}
          {item.auditState === 1 && (
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={() => handlerEdit(1, item)}
            >
              通过
            </Button>
          )}
        </div>
      )
    }
  ]
  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(item) => item._id}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 30],
          defaultPageSize: 10,
          total: dataSource.length,
          showTotal: (total, range) => `${range[0]}-${range[1]}  总${total}条`
        }}
      />
    </div>
  )
}
