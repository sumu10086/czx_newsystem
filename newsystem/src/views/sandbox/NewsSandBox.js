import React from "react"
// 路由
import { Outlet } from "react-router-dom"
// redux
// import { useSelector } from "react-redux"
// 组件
import SideMenu from "../../components/sandbox/SideMenu"
import TopHeader from "../../components/sandbox/TopHeader"
// css
import "./NewsSandBox.scss"
// antd
// import { DeploymentUnitOutlined } from "@ant-design/icons"
// import { Layout, theme, Skeleton, Spin } from "antd"
import { Layout, theme } from "antd"
const { Content } = Layout
// NewsSandBox
export default function NewsSandBox() {
  // const loading = useSelector((state) => state.loadingSliceReducer.loading)
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  return (
    <Layout>
      <SideMenu />
      <Layout>
        <TopHeader />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            overflow: "auto"
          }}
        >
          {/* <Spin
            spinning={loading}
            tip="发狂加载中...."
            indicator={
              <DeploymentUnitOutlined spin style={{ color: "orange" }} />
            }
            size="large"
          > */}
          {/* <Skeleton loading={loading} active round> */}
          {/* 路由出口 */}
          <Outlet />
          {/* </Skeleton> */}
          {/* </Spin> */}
        </Content>
      </Layout>
    </Layout>
  )
}
