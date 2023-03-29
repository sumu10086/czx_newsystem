import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
// redux
import { useDispatch } from "react-redux"
import { changeUserInfo } from "../../../redux/reducer/topHeaderReducer"
// antd
import {
  UserAddOutlined,
  EditTwoTone,
  DeleteOutlined,
  ExclamationCircleFilled,
  InfoCircleTwoTone,
  SmileOutlined,
  FrownOutlined,
  UserOutlined,
  RadarChartOutlined,
  SettingOutlined
} from "@ant-design/icons"
import { Button, Table, Modal, notification, Space, Switch } from "antd"
import UserAddForm from "../../../components/user-manage/UserAddForm"
export default function UserList() {
  const dispatch = useDispatch()
  const [userList, setuserList] = useState([])
  const { user } = JSON.parse(localStorage.getItem("userInfo"))
  useEffect(() => {
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor"
    }
    axios.get("/api/sys/userList").then((res) => {
      let list = res.data.data
      // console.log(list)
      setuserList(
        roleObj[user.roleId] === "superadmin"
          ? list
          : [
              ...list.filter((v) => v.mobile === user.mobile),
              ...list.filter(
                (v) =>
                  v.region === user.region && roleObj[v.roleId] === "editor"
              )
            ]
      )
    })
  }, [user.mobile, user.region, user.roleId])

  /**
   *新增用户 和 修改用户
   */
  // UserAddForm and UserEditForm
  const [regionList, setregionList] = useState([])
  const [roleList, setroleList] = useState([])
  const formRef = useRef(null)
  const [currentUser, setcurrentUser] = useState({})
  useEffect(() => {
    axios.get("/api/sys/regionList").then((res) => {
      let list = res.data.data
      // console.log(list)
      setregionList(list)
    })
  }, [])
  useEffect(() => {
    axios.get("/api/sys/roleList").then((res) => {
      let list = res.data.data
      // console.log(list)
      setroleList(list)
    })
  }, [])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 拿到用户图片地址
  const [roleImg, setroleImg] = useState("")
  const handlerRoleImg = (roleImg) => {
    setroleImg(roleImg)
  }
  // 拿到用户图片地址

  const editUserBtn = (type, item) => {
    // type 1  添加 0 修改
    // console.log(item)
    setcurrentUser(item)
    if (type) {
      // 重置表单
      new Promise((resolve, reject) => {
        setIsModalOpen(true)
        resolve()
      }).then(() => formRef.current.resetFields())
    } else {
      // 如果是修改
      // console.log(currentUser)
      // console.log(formRef.current)
      // 重新给表单赋值
      new Promise((resolve, reject) => {
        setIsModalOpen(true)
        resolve()
      }).then(() => formRef.current.setFieldsValue(item))
    }
  }
  const editUserOk = () => {
    // console.log(formRef.current)
    formRef.current
      .validateFields()
      .then((value) => {
        // console.log(value)
        // console.log(currentUser)
        var obj = {
          mobile: value.mobile,
          password: value.password,
          roleState: value.roleId === 1 || currentUser.roleState ? true : false,
          default: value.roleId === 1 ? true : false,
          region: value.region,
          roleId: value.roleId,
          roleMsg: value.roleMsg,
          roleImg: roleImg
        }

        if (!currentUser._id) {
          // console.log("确定添加")
          axios
            .post("/api/sys/adduser", obj)
            .then((res) => {
              console.log(res)
              if (res.data.info === "fail") {
                openNotification(2, `添加用户失败`, "用户已注册！！")
              } else {
                // 连表数据整合
                let newuser = res.data.data[0]
                let roles = roleList.filter(
                  (v) => v.roleType === newuser.roleId
                )[0]
                newuser = { ...newuser, roles: roles }
                setuserList([...userList, newuser])
                openNotification(
                  1,
                  `添加用户成功`,
                  "但未开启状态，请手动打开！！"
                )
              }
              setIsModalOpen(false)
            })
            .catch((err) => {
              openNotification(2, `添加用户失败`, "请稍后再试！！")
              setIsModalOpen(false)
            })
        } else {
          // console.log("确定修改")
          // console.log(currentUser._id)
          axios
            .post("/api/sys/updateUserList", {
              id: currentUser._id,
              obj
            })
            .then((res) => {
              let roles = roleList.filter((v) => v.roleType === obj.roleId)[0]
              obj = { ...obj, roles: roles }
              setuserList(
                userList.map((v) => {
                  if (v._id === currentUser._id) {
                    v = { ...v, ...obj }
                    return v
                  }
                  return v
                })
              )

              //更新userinfo数据
              axios
                .post("/api/sys/updateUserInfo", {
                  id: currentUser._id,
                  roleImg
                })
                .then((result) => {
                  // 个人信息更新
                  dispatch(changeUserInfo(result.data.data))
                  // console.log(result.data.data)
                })
              //更新userinfo数据

              openNotification(1, `用户${currentUser.mobile}修改成功`)
              setIsModalOpen(false)
            })
            .catch((err) => {
              openNotification(
                2,
                `用户${currentUser.mobile}修改失败`,
                "请稍后再试！！"
              )
              setIsModalOpen(false)
            })
        }

        // 重置表单
        // formRef.current.resetFields()
      })
      .catch((err) => {
        openNotification(2, `添加用户失败`, "请完善表单！！")
      })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  /**
   *新增用户 和 修改用户
   */

  /**
   * 用户状态修改 和 删除
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
    // 1 用户状态修改 0 删除
    let name = item.mobile
    let openStateText = item.roleState ? "关闭" : "开启"
    let okText = type ? openStateText : "删除"
    confirm({
      icon: type ? <InfoCircleTwoTone /> : <ExclamationCircleFilled />,
      title: type ? "用户状态修改" : "删除",
      content: type
        ? `点击${okText}可修改${name}用户状态`
        : `你确定要删除${name}?`,
      cancelText: type ? "取消" : "再想一想",
      okText: okText,
      okType: type ? "" : "danger",
      okButtonProps: type ? { type: "primary" } : { type: "primary" },
      // centered: true,
      onOk() {
        return new Promise((resolve, reject) => {
          if (type) {
            // 用户状态修改
            let obj = {
              roleState: !item.roleState
            }
            axios
              .post("/api/sys/updateUserList", {
                id: item._id,
                obj
              })
              .then((res) => {
                setuserList(
                  userList.map((v) => {
                    if (v._id === item._id) {
                      v.roleState = !v.roleState
                      return v
                    }
                    return v
                  })
                )
                openNotification(1, `${okText}${name}成功`)
                resolve()
              })
              .catch((err) => {
                openNotification(2, `${okText}${name}失败`, "请稍后再试！！~_~")
                reject(err)
              })
          } else {
            // 删除
            axios
              .post("/api/sys/delUserList", {
                id: item._id
              })
              .then((res) => {
                setuserList(userList.filter((v) => v._id !== item._id))
                openNotification(1, `${okText}${name}成功`)
                resolve()
              })
              .catch((err) => {
                openNotification(2, `${okText}${name}失败`, "请稍后再试！！~_~")
                reject(err)
              })
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
   * 用户状态修改 和 删除
   */

  // Table配置
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      key: "region",
      render: (region) => <b>{region ? region : "全球"}</b>,
      filters: [
        ...regionList.map((v) => {
          return {
            text: v.title,
            value: v.value
          }
        }),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === ""
        } else {
          return item.region === value
        }
      }
    },
    {
      title: "角色名称",
      key: "_id",
      render: (item) => <b>{item.roles.roleName}</b>
    },
    {
      title: "用户名",
      key: "mobile",
      dataIndex: "mobile",
      render: (mobile) => {
        return (
          <div>
            <UserOutlined />
            {mobile}
          </div>
        )
      }
    },
    {
      title: "用户状态",
      key: "roleState",
      dataIndex: "roleState",
      render: (roleState, item) => (
        <Space>
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            disabled={item.default}
            checked={roleState}
            onClick={() => handlerEdit(1, item)}
          />
        </Space>
      )
    },
    {
      title: "操作",
      key: "_id",
      align: "center",
      render: (item) => (
        <div>
          <Button
            type="dashed"
            icon={<EditTwoTone spin={!item.default} />}
            disabled={item.default}
            shape="circle"
            size="large"
            className="margin-rl-10"
            onClick={() => editUserBtn(0, item)}
          />
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            disabled={item.default}
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
      <Button
        type="primary"
        icon={<UserAddOutlined />}
        size="large"
        ghost
        block
        style={{ marginBottom: "6px" }}
        onClick={() => editUserBtn(1, "")}
      >
        新增用户
      </Button>
      <Modal
        title={
          <div style={{ color: currentUser._id ? "red" : "skyblue" }}>
            {currentUser._id ? (
              <SettingOutlined
                spin
                style={{ margin: "10px", fontSize: "26px" }}
              />
            ) : (
              <UserAddOutlined style={{ fontSize: "30px" }} />
            )}
            {currentUser._id
              ? `修改当前用户--${currentUser.mobile}`
              : "添加新用户"}
          </div>
        }
        cancelText={currentUser._id ? `取消修改` : "取消添加"}
        okText={currentUser._id ? `确定修改` : "确定添加"}
        open={isModalOpen}
        onOk={() => editUserOk()}
        onCancel={handleCancel}
      >
        <UserAddForm
          ref={formRef}
          regionList={regionList}
          roleList={roleList}
          currentUser={currentUser}
          handlerRoleImg={handlerRoleImg}
        ></UserAddForm>
      </Modal>
      <Table
        columns={columns}
        dataSource={userList}
        rowKey={(item) => item._id}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 30],
          defaultPageSize: 10,
          total: userList.length,
          showTotal: (total, range) => `${range[0]}-${range[1]}  总${total}条`
        }}
      />
    </div>
  )
}
