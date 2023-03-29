/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react"
import axios from "axios"
// css
import "./right-manage.scss"
// antd
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  InfoCircleTwoTone,
  SmileOutlined,
  FrownOutlined,
  SyncOutlined,
  RadarChartOutlined
} from "@ant-design/icons"
import { Button, Table, Tag, Modal, notification, Space, Switch } from "antd"

export default function RightList() {
  const [rightList, setrightList] = useState([])
  useEffect(() => {
    axios.get("/api/sys/sideList").then((res) => {
      let list = res.data.data
      list = list.map((v) => {
        v.children = v.children.filter((child) =>
          Object.hasOwnProperty.call(child, "pagepermisson")
        )
        if (!v.children.length) {
          v.children = ""
        }
        v.id = `${v.id}--[${v.children.length}]`
        return v
      })
      // console.log(list)
      setrightList(list)
    })
  }, [])

  /**
   * 操作
   */
  const { confirm } = Modal
  const [api, contextHolder] = notification.useNotification()
  const openNotification = (
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
    // 1 编辑 0 删除
    let name = item.title
    let openStateText = item.pagepermisson ? "关闭" : "开启"
    let okText = type ? openStateText : "删除"
    confirm({
      icon: type ? <InfoCircleTwoTone /> : <ExclamationCircleFilled />,
      title: type ? "编辑" : "删除",
      content: type ? `点击编辑可修改${name}权限` : `你确定要删除${name}?`,
      cancelText: type ? "取消" : "再想一想",
      okText: okText,
      okType: type ? "" : "danger",
      okButtonProps: type ? { type: "primary" } : { type: "primary" },
      // centered: true,
      onOk() {
        return new Promise((resolve, reject) => {
          if (type) {
            // 编辑
            // 如果是孩子且父元素未授权 直接return
            if (item.grade !== 1) {
              let father = rightList.filter(
                (v) => Number(String(v.id).split("--")[0]) === item.rightId
              )[0]
              if (!father.pagepermisson) {
                setTimeout(() => {
                  openNotification(
                    2,
                    `${okText}${name}失败`,
                    `请先打开上一级--${father.title}`
                  )
                  resolve()
                }, 500)
                return
              }
            }
            // pagepermisson 修改
            item.pagepermisson = item.pagepermisson ? 0 : 1
            // 如果是父元素，父元素打开子元素全打开，父元素关闭子元素全关闭
            if (item.children?.length) {
              item.children = item.children.map((child) => {
                child.pagepermisson = item.pagepermisson
                axios.post(`/api/sys/updateChildrens`, {
                  id: child._id,
                  pagepermisson: child.pagepermisson
                })
                return child
              })
            }
            let updateDB =
              item.grade === 1 ? "updateRightList" : "updateChildrens"
            axios
              .post(`/api/sys/${updateDB}`, {
                id: item._id,
                pagepermisson: item.pagepermisson
              })
              .then((res) => {
                setTimeout(() => {
                  setrightList([...rightList])
                  openNotification(1, `${okText}${name}成功`)
                  resolve()
                }, 500)
              })
          } else {
            // 删除
            //删第一层
            if (item.grade === 1) {
              // axios
              //   .post(" /api/sys/delRightList", {
              //     id: item._id
              //   })
              //   .then(res => {
              setTimeout(() => {
                setrightList(rightList.filter((v) => v._id !== item._id))
                openNotification(1, `${okText}${name}成功`)
                resolve()
              }, 500)
              //   })
            } else {
              //删第二层 先找爸爸 再过滤儿子
              // axios
              //   .post(" /api/sys/delChildrens", {
              //     id: item._id
              //   })
              //   .then(res => {
              let list = rightList.filter(
                (v) => Number(String(v.id).split("--")[0]) === item.rightId
              )
              list[0].children = list[0].children.filter(
                (v) => v._id !== item._id
              )
              setTimeout(() => {
                setrightList([...rightList])
                openNotification(1, `${okText}${name}成功`)
                resolve()
              }, 500)
              //   })
            }
          }
        }).catch((err) => {
          openNotification(2, `${okText}${name}失败`, "请稍后再试！！~_~")
          console.log("Oops errors!")
        })
      },
      onCancel() {
        openNotification(3, `取消成功`, "请继续你的操作")
      }
    })
  }
  /**
   * 操作
   */

  // Table配置
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      key: "id",
      render: (id) => <a className="a">{id}</a>,
      sorter: (a, b) => {
        return String(a.id).split("--")[0] - String(b.id).split("--")[0]
      }
    },
    {
      title: "权限名称",
      dataIndex: "title",
      align: "center",
      key: "title",
      render: (title) => <b>{title}</b>,
      filters: rightList.map((v) => {
        return {
          text: v.title,
          value: v.title
        }
      }),
      onFilter: (value, record) => record.title.indexOf(value) === 0
    },
    {
      title: "权限路径",
      key: "key",
      dataIndex: "key",
      align: "center",
      render: (key) => {
        let color = "pink"
        switch (key.split("/").length) {
          case 2:
            color = "#2570a1"
            break
          case 3:
            color = "#ffc20e"
            break
          default:
            color = "green"
            break
        }
        return (
          <Tag icon={<SyncOutlined spin />} color={color}>
            {key}
          </Tag>
        )
      }
    },
    {
      title: "操作",
      key: "_id",
      align: "center",
      render: (item) => (
        <div className="flex-center">
          <Space>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              disabled
              checked={item.pagepermisson}
            />
          </Space>

          <Button
            type="primary"
            icon={<EditOutlined spin />}
            shape="circle"
            size="large"
            className="margin-rl-10"
            onClick={() => handlerEdit(1, item)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            shape="circle"
            size="large"
            className="margin-rl-10"
            onClick={() => handlerEdit(0, item)}
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
        dataSource={rightList}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [2, 5, 10, 20],
          defaultPageSize: 5,
          total: rightList.length,
          showTotal: (total, range) => `${range[0]}-${range[1]}  总${total}条`
        }}
      />
    </div>
  )
}
