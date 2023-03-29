/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react"
import axios from "axios"
// css
import "./right-manage.scss"
// antd
import {
  ProfileOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  SmileOutlined,
  FrownOutlined,
  DribbbleOutlined,
  AntCloudOutlined,
  AliwangwangOutlined
} from "@ant-design/icons"
import { Button, Table, Modal, notification, Tree } from "antd"

export default function RoleList() {
  const [roleList, setroleList] = useState([])

  const [sideList, setsideList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRights, setcurrentRights] = useState([])
  const [currentRightID, setcurrentRightID] = useState(null)
  const [currentRoleName, setcurrentRoleName] = useState("")
  useEffect(() => {
    axios.get("/api/sys/roleList").then((res) => {
      let list = res.data.data
      setroleList(list)
    })
  }, [])

  // 获取连表数据
  useEffect(() => {
    axios.get("/api/sys/sideList").then((res) => {
      let list = res.data.data
      setsideList(list)
    })
  }, [])

  // Table配置
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <a className="roleID">{id}</a>,
      sorter: (a, b) => {
        return a.id - b.id
      }
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
      align: "center",
      render: (roleName) => <b>{roleName}</b>
    },
    {
      title: "操作",
      key: "_id",
      align: "center",
      render: (item) => (
        <div>
          <Modal
            title={
              <div>
                <AntCloudOutlined style={{ color: "#009ad6" }} />
                --权限分配--{currentRoleName}
              </div>
            }
            open={isModalOpen}
            onOk={() => handlerEdit(1)}
            onCancel={() => handlerEdit(0)}
            cancelText="取消"
            okText="更新"
            okButtonProps={{ type: "primary" }}
          >
            <Tree
              // fieldNames={{ title: "title", key: "key", children: "children" }}
              treeData={sideList}
              checkedKeys={currentRights}
              checkable
              checkStrictly
              showLine
              onSelect={onSelect}
              switcherIcon={
                <AliwangwangOutlined
                  style={{ fontSize: "16px", color: "#f15a22" }}
                />
              }
              onCheck={onCheck}
            />
          </Modal>
          <Button
            type="primary"
            icon={<ProfileOutlined spin />}
            shape="circle"
            size="large"
            className="margin-rl-10"
            onClick={() => handlerShowEdit(item)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            shape="circle"
            size="large"
            className="margin-rl-10"
            onClick={() => handlerDel(item)}
          />
        </div>
      )
    }
  ]

  /**
   * 操作
   */
  const [api, contextHolder] = notification.useNotification()
  const { confirm } = Modal
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
          <DribbbleOutlined
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

  // 编辑
  const handlerShowEdit = (item) => {
    setcurrentRights(item.rights)
    setcurrentRightID(item._id)
    setcurrentRoleName(item.roleName)
    setIsModalOpen(true)
  }
  // tree权限修改
  const onCheck = (checkedKeys, e) => {
    setcurrentRights(checkedKeys.checked)
    // 如果取消且为第一层则孩子都得取消
    if (!e.checked && e.node.grade === 1) {
      setcurrentRights(
        currentRights.map((v) => {
          if (v.includes(e.node.key)) {
            return ""
          }
          return v
        })
      )
    }
  }
  // 点击title选中
  const onSelect = (selec, e) => {
    e.selected
      ? setcurrentRights([...currentRights, e.node.key])
      : setcurrentRights(currentRights.filter((v) => v !== e.node.key))

    // 如果取消且为第一层则孩子都得取消
    if (!e.checked && e.node.grade === 1) {
      setcurrentRights(
        currentRights.map((v) => {
          if (v.includes(e.node.key)) {
            return ""
          }
          return v
        })
      )
    }
  }
  // tree权限修改

  // 编辑按钮操作
  const handlerEdit = (type) => {
    // type 为 1 确定编辑 0 取消
    if (type) {
      setIsModalOpen(false)
      axios
        .post("/api/sys/updateRoleList", {
          id: currentRightID,
          rights: currentRights
        })
        .then((res) => {
          setroleList(
            roleList.map((v) => {
              if (v._id === currentRightID) {
                return { ...v, rights: currentRights }
              }
              return v
            })
          )
          openNotification(1, "更新", `已更新${currentRoleName}`)
        })
    } else {
      setIsModalOpen(false)
      openNotification(1, "编辑操作", `已退出${currentRoleName}操作`)
    }
  }

  // 编辑

  // 删除
  const handlerDel = (item) => {
    // 弹出层配置
    let name = item.roleName
    let okText = "删除"
    confirm({
      icon: <ExclamationCircleFilled />,
      title: "删除",
      content: `你确定要删除${name}?`,
      cancelText: "再想一想",
      okText,
      okType: "danger",
      okButtonProps: { type: "primary" },
      onOk() {
        return new Promise((resolve, reject) => {
          // 删除操作
          // axios
          //   .post(" /api/sys/delRoleList", {
          //     id: item._id
          //   })
          //   .then((res) => {
          setTimeout(() => {
            setroleList(
              roleList.filter((v) => {
                return v._id !== item._id
              })
            )
            openNotification(1, `${okText}${name}成功`)
            resolve()
          }, 500)
          // })
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
  // 删除
  /**
   * 操作
   */

  return (
    <div>
      {contextHolder}
      <Table
        dataSource={roleList}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [2, 5, 10, 20],
          defaultPageSize: 5,
          total: roleList.length,
          showTotal: (total, range) => `${range[0]}-${range[1]}  总${total}条`
        }}
      />
    </div>
  )
}
