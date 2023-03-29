import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// css
import style from "./news-manage.module.scss"
// antd
import {
  EditTwoTone,
  DeleteOutlined,
  ExclamationCircleFilled,
  InfoCircleTwoTone,
  SmileOutlined,
  FrownOutlined,
  RadarChartOutlined,
  VerticalAlignTopOutlined,
  QqOutlined
} from "@ant-design/icons"
import { Button, Table, Modal, notification } from "antd"

export default function NewsDraft() {
  const [newsDraftList, setnewsDraftList] = useState([])
  const { user } = JSON.parse(localStorage.getItem("userInfo"))
  const userDraftInfo = {
    author: user.mobile,
    auditState: 0
  }
  useEffect(() => {
    axios
      .get(
        `/api/sys/newsDraft?author=${userDraftInfo.author}&auditState=${userDraftInfo.auditState}`
      )
      .then((res) => {
        let list = res.data.data
        setnewsDraftList(list)
      })
  }, [userDraftInfo.auditState, userDraftInfo.author])

  /**
   * 新闻状态修改 和 删除
   */
  const { confirm } = Modal
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
  const handlerEdit = (type, item) => {
    // 1 新闻状态修改 0 删除
    let title = `《${item.title}》`
    let okText = type ? "上传" : "删除"
    confirm({
      icon: type ? <InfoCircleTwoTone /> : <ExclamationCircleFilled />,
      title: type ? "新闻状态修改" : "删除",
      content: type ? `点击${okText}${title}至审核` : `你确定要删除${title}?`,
      cancelText: type ? "取消" : "再想一想",
      okText: okText,
      okType: type ? "" : "danger",
      okButtonProps: type ? { type: "primary" } : { type: "primary" },
      // centered: true,
      onOk() {
        return new Promise((resolve, reject) => {
          if (type) {
            // 新闻状态修改
            // console.log("新闻状态修改")
            let updateObj = {
              id: item._id,
              updateObj: { auditState: 1 }
            }
            axios.post("/api/sys/updateNewsList", updateObj).then((res) => {
              setnewsDraftList(newsDraftList.filter((v) => v._id !== item._id))
              openNotification(1, `${okText}${title}成功`)
              resolve()
            })
          } else {
            // 删除
            axios
              .post("/api/sys/delnewsDraftList", {
                id: item._id
              })
              .then((res) => {
                setnewsDraftList(
                  newsDraftList.filter((v) => v._id !== item._id)
                )
                openNotification(1, `${okText}${title}成功`)
                resolve()
              })
              .catch((err) => {
                openNotification(
                  2,
                  `${okText}${title}失败`,
                  "请稍后再试！！~_~"
                )
                reject(err)
              })
          }
        }).catch((err) => {
          openNotification(2, `${okText}${title}失败`, "请稍后再试！！~_~")
          console.log("Oops errors!")
        })
      },
      onCancel() {
        openNotification(3, `取消成功`, "请继续你的操作")
      }
    })
  }
  /**
   * 新闻状态修改 和 删除
   */

  //跳转详情页
  const navigate = useNavigate()

  // Table配置
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (id) => <b>{id}</b>
    },
    {
      title: "新闻标题",
      key: "_id",
      align: "center",
      render: (item) => (
        <span
          className={style.hover}
          onClick={() => navigate(`/news-manage/preview/${item._id}`)}
        >
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
      render: (categorie) => categorie.title
    },
    {
      title: "操作(删除、修改、上传审核)",
      key: "_id",
      align: "center",
      render: (item) => (
        <div>
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            shape="circle"
            size="large"
            className="margin-rl-10"
            onClick={() => handlerEdit(0, item)}
          />
          <Button
            type="dashed"
            icon={<EditTwoTone />}
            shape="circle"
            size="large"
            className="margin-rl-10"
            onClick={() => navigate(`/news-manage/update/${item._id}`)}
          />

          <Button
            type="primary"
            icon={<VerticalAlignTopOutlined />}
            shape="circle"
            size="large"
            className="margin-rl-10"
            onClick={() => handlerEdit(1, item)}
          />
        </div>
      )
    }
  ]

  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={newsDraftList}
        rowKey={(item) => item._id}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 30],
          defaultPageSize: 10,
          total: newsDraftList.length,
          showTotal: (total, range) => `${range[0]}-${range[1]}  总${total}条`
        }}
      />
    </div>
  )
}
