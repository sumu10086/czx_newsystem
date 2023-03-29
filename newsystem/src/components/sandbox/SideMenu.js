import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
// redux
import { useSelector } from "react-redux"
// css
import style from "./sandbox.module.scss"
// antd
import {
  GithubOutlined,
  UserOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ContainerOutlined,
  CrownOutlined,
  HighlightOutlined,
  CalendarOutlined,
  DeploymentUnitOutlined,
  DesktopOutlined,
  InsertRowBelowOutlined,
  ScheduleOutlined,
  VerifiedOutlined,
  WifiOutlined,
  TagsOutlined,
  NodeExpandOutlined,
  FundViewOutlined,
  FormatPainterOutlined
} from "@ant-design/icons"
import { Layout, Menu, Button } from "antd"
const { Sider } = Layout

// 模拟数据
// const menuList = [
//   {
//     key: "/home",
//     title: "首页",
//     icon: <UserOutlined />
//   }
// ]

// menu图标
const sideMenuIcon = {
  "/home": <GithubOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <TeamOutlined />,
  "/right-manage": <DatabaseOutlined />,
  "/right-manage/role/list": <ContainerOutlined />,
  "/right-manage/right/list": <CrownOutlined />,
  "/news-manage": <VerifiedOutlined />,
  "/news-manage/add": <HighlightOutlined />,
  "/news-manage/draft": <CalendarOutlined />,
  "/news-manage/category": <DeploymentUnitOutlined />,
  "/audit-manage": <ScheduleOutlined />,
  "/audit-manage/audit": <DesktopOutlined />,
  "/audit-manage/list": <InsertRowBelowOutlined />,
  "/publish-manage": <TagsOutlined />,
  "/publish-manage/unpublished": <NodeExpandOutlined />,
  "/publish-manage/published": <FundViewOutlined />,
  "/publish-manage/sunset": <FormatPainterOutlined />
}
// 项函数
function getItem(label, key, icon = <WifiOutlined />, children, type) {
  return {
    label,
    key,
    icon,
    children,
    type
  }
}
// 检测权限开关
const checkPagepermisson = (item) => {
  return (
    item.pagepermisson === 1 &&
    JSON.parse(localStorage.getItem("userInfo")).role.rights.includes(item.key)
  )
}
// 渲染menu 递归找儿子
const renderMenu = (list) => {
  return list.map((item) => {
    if (item.children?.length && checkPagepermisson(item)) {
      return getItem(
        item.title,
        item.key,
        sideMenuIcon[item.key],
        renderMenu(item.children)
      )
    }
    return checkPagepermisson(item)
      ? getItem(item.title, item.key, sideMenuIcon[item.key])
      : ""
  })
}

// SideMenu
export default function SideMenu() {
  const [menuList, setmenuList] = useState([])
  useEffect(() => {
    axios.get("/api/sys/sideList").then((res) => {
      // console.log(res.data.data)
      setmenuList(res.data.data)
    })
  }, [])
  // 路由跳转
  const navigate = useNavigate()
  const handlerMenu = (e) => {
    // console.log(e.key)
    navigate(e.key)
  }
  // 路由信息
  const pathnameArr = [useLocation().pathname]
  const openPathnameArr = ["/" + pathnameArr[0].split("/")[1]]

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={useSelector((state) => state.topHeaderSliceReducer.topCollapsed)}
      width="260px"
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className={style.logo}>苏沐新闻发布管理系统</div>
        <Menu
          style={{ flex: 1, overflow: "auto", fontSize: "16px" }}
          theme="dark"
          mode="inline"
          items={renderMenu(menuList)}
          onClick={handlerMenu}
          selectedKeys={pathnameArr}
          defaultOpenKeys={openPathnameArr}
        />
        <Button type="primary" ghost onClick={() => navigate("news")}>
          去新闻阅读中心
        </Button>
      </div>
    </Sider>
  )
}
