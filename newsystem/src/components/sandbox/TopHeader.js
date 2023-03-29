/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
// redux
import { useSelector, useDispatch } from "react-redux"
import { changeTopCollapsed } from "../../redux/reducer/topHeaderReducer"

// screenfulls
import screenfull from "screenfull"
// css
import style from "./sandbox.module.scss"
// antd
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from "@ant-design/icons"
import { Layout, theme, Dropdown, Space, Avatar, Badge, Breadcrumb } from "antd"
const { Header } = Layout
export default function TopHeader() {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  // 拿到登陆后返回的当前用户数据
  const [userInfo, setuserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  )
  useEffect(() => {
    setuserInfo(JSON.parse(localStorage.getItem("userInfo")))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSelector((state) => state.topHeaderSliceReducer.userInfo)])

  const items = [
    {
      key: "1",
      label: userInfo?.role.roleName
    },
    { key: "loginOut", danger: true, label: "退出登录" }
  ]

  const navigate = useNavigate()
  const onClick = ({ key }) => {
    if (key === "loginOut") {
      localStorage.removeItem("token")
      localStorage.removeItem("userInfo")
      localStorage.removeItem("persist:czxPersist")
      navigate("/login")
    }
  }

  // redux
  const dispatch = useDispatch()
  const collapsed = useSelector(
    (state) => state.topHeaderSliceReducer.topCollapsed
  )

  // 面包屑
  const breadcrumbNameMap = {
    "/home": "首页",
    "/user-manage": "用户管理",
    "/user-manage/list": "用户列表",
    "/right-manage": "权限管理",
    "/right-manage/role/list": "角色列表",
    "/right-manage/right/list": "权限列表",
    "/news-manage": "新闻管理",
    "/news-manage/add": "撰写新闻",
    "/news-manage/draft": "草稿箱",
    "/news-manage/preview/:id": "新闻预览",
    "/news-manage/update/:id": "新闻更新",
    "/news-manage/category": "新闻分类",
    "/audit-manage": "审核管理",
    "/audit-manage/audit": "审核新闻",
    "/audit-manage/list": "审核列表",
    "/publish-manage": "发布管理",
    "/publish-manage/unpublished": "待发布",
    "/publish-manage/published": "已发布",
    "/publish-manage/sunset": "已下线"
  }
  const location = useLocation()
  const pathSnippets = location.pathname.split("/").filter((i) => i)
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`
    // console.log(url)
    return {
      key: url,
      title: breadcrumbNameMap[url]
      // title: <a href={`#${url}`}>{breadcrumbNameMap[url]}</a>
    }
  })
  const breadcrumbItems = [].concat(extraBreadcrumbItems)

  // 是否全屏
  const [isFullscreen, setisFullscreen] = useState(false)
  useEffect(() => {}, [])
  // 监听变化
  const handleFullscreen = () => {
    setisFullscreen(!isFullscreen)
    screenfull.toggle()
  }
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <div className={style.flexTopBox}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: style.trigger,
              onClick: () => dispatch(changeTopCollapsed())
            }
          )}
          <Breadcrumb items={breadcrumbItems} />
          <div onClick={handleFullscreen} className={style.fullscreen}>
            {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </div>
        </div>
        <Dropdown menu={{ items, onClick }}>
          <Space>
            <span>
              欢迎
              <a>{userInfo?.user.mobile}</a>
              回来
            </span>
            <Space size={24}>
              <Badge count={1}>
                <Avatar
                  src={userInfo?.user.roleImg}
                  shape="square"
                  icon={<UserOutlined />}
                />
              </Badge>
            </Space>
          </Space>
        </Dropdown>
      </div>
    </Header>
  )
}
