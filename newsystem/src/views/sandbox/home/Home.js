import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// lodash
import _ from "lodash"
// echart
import EchartBar from "../../../components/home/EchartBar"
import EchartPie from "../../../components/home/EchartPie"
// css
import style from "./Home.module.scss"
// antd
import {
  EditOutlined,
  EllipsisOutlined,
  PieChartOutlined,
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
  EyeOutlined,
  BarChartOutlined,
  DotChartOutlined,
  HeartOutlined
} from "@ant-design/icons"
import { Card, Col, Row, Avatar, List, Space, Drawer } from "antd"
const { Meta } = Card
export default function Home() {
  const { user, role } = JSON.parse(localStorage.getItem("userInfo"))
  // viewsList
  const [viewsList, setviewsList] = useState([])
  const [viewLoading, setviewLoading] = useState(true)
  // echart
  const [echartBarData, setechartBarData] = useState({})
  const [echartPieData, setechartPieData] = useState({})
  useEffect(() => {
    let matchStr = JSON.stringify({
      publishState: 2
    })
    let sortStr = JSON.stringify({
      // 倒序排序
      view: -1
    })
    axios
      .get(`/api/sys/newsList?matchStr=${matchStr}&&sortStr=${sortStr}`)
      .then((res) => {
        // console.log(res.data.data)
        setviewsList(
          res.data.data.map((v, i) => ({
            id: v._id,
            href: `#/news-manage/preview/${v._id}`,
            title: v.title,
            // avatarSrc: `https://joesch.moe/api/v1/random?key=${i}`,
            avatarSrc: v.roleImg,
            description: v.categorie.title,
            content: v.content,
            region: v.region,
            publishTime: new Date(v.publishTime).toLocaleString(),
            view: v.view,
            star: v.star
          }))
        )
        setviewLoading(false)
        // echart
        setechartBarData(
          _.groupBy(res.data.data, (item) => item.categorie.title)
        )
        setechartPieData(
          _.groupBy(
            res.data.data.filter((item) => item.author === user.mobile),
            (item) => item.categorie.title
          )
        )
        // console.log(
        //   _.groupBy(
        //     res.data.data.filter((item) => item.author === user.mobile),
        //     (item) => item.categorie.title
        //   )
        // )
        // console.log(
        //   Object.keys(
        //     _.groupBy(
        //       res.data.data.filter((item) => item.author === user.mobile),
        //       (item) => item.categorie.title
        //     )
        //   )
        // )
      })
    // 取消onresize监听
    return () => {
      window.onresize = null
    }
  }, [user.mobile])
  // starList
  const [starList, setstarList] = useState([])
  const [starLoading, setstarLoading] = useState(true)
  useEffect(() => {
    let matchStr = JSON.stringify({
      publishState: 2,
      star: { $gte: 1 }
    })
    let sortStr = JSON.stringify({
      // 倒序排序
      view: -1
    })
    axios
      .get(`/api/sys/newsList?matchStr=${matchStr}&&sortStr=${sortStr}`)
      .then((res) => {
        // console.log(res.data.data)
        setstarList(
          res.data.data.map((v, i) => ({
            id: v._id,
            href: `#/news-manage/preview/${v._id}`,
            title: v.title,
            // avatarSrc: `https://joesch.moe/api/v1/random?key=${i}`,
            avatarSrc: v.roleImg,
            description: v.categorie.title,
            content: v.content,
            region: v.region,
            publishTime: new Date(v.publishTime).toLocaleString(),
            view: v.view,
            star: v.star
          }))
        )
        setstarLoading(false)
      })
  }, [])

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  )

  // toPreview
  const navigate = useNavigate()
  const toPreview = (item) => {
    navigate(`/news-manage/preview/${item.id}`)
  }

  // 弹出框
  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Row gutter={10}>
        {/* 用户最常浏览 */}
        <Col span={8}>
          <Card
            style={{ height: "400px" }}
            hoverable
            title={
              <div>
                用户最常浏览
                <BarChartOutlined className={style.icon} />
              </div>
            }
            loading={viewLoading}
            extra={<EyeOutlined className={style.pink} />}
          >
            <List
              style={{ overflow: "auto", height: "300px" }}
              itemLayout="horizontal"
              dataSource={viewsList}
              renderItem={(item, index) => (
                <List.Item onClick={() => toPreview(item)}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatarSrc} />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={<a href={item.href}>{item.publishTime}</a>}
                  />
                  <span className={style.orange}>
                    <EyeOutlined />
                    {item.view}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        {/* 用户点赞最多 */}
        <Col span={8}>
          <Card
            hoverable
            style={{ height: "400px" }}
            title={
              <div>
                用户点赞最多
                <DotChartOutlined className={style.icon} />
              </div>
            }
            loading={starLoading}
            extra={<HeartOutlined className={style.red} />}
          >
            <List
              style={{ overflow: "auto", height: "300px" }}
              itemLayout="horizontal"
              dataSource={starList}
              renderItem={(item, index) => (
                <List.Item onClick={() => toPreview(item)}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatarSrc} />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={<a href={item.href}>{item.publishTime}</a>}
                  />
                  <span className={style.red}>
                    <LikeOutlined />
                    {item.star}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        {/* 个人信息 */}
        <Col span={8}>
          <Card
            hoverable
            style={{
              height: "400px"
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined onClick={showDrawer} />,
              <EditOutlined />,
              <EllipsisOutlined />
            ]}
          >
            <Meta
              avatar={<Avatar src={user.roleImg} />}
              title={user.mobile}
              description={
                <div>
                  <b> {user.region ? user.region : "全球"}</b>
                  <span className={style.mglf}> {role.roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      {/* 新闻预览 */}
      <Card
        hoverable
        title="新闻预览"
        style={{ marginTop: "30px" }}
        loading={viewLoading}
      >
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page)
            },
            pageSize: 3
          }}
          dataSource={viewsList}
          // footer={
          //   <div>
          //     <b>ant design</b> footer part
          //   </div>
          // }
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={[
                <IconText icon={StarOutlined} text={item.view} />,
                <IconText icon={LikeOutlined} text={item.star} />,
                <IconText icon={MessageOutlined} text="0" />
              ]}
              extra={<img width={200} alt="头像" src={item.avatarSrc} />}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatarSrc} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                style={{ maxHeight: "120px", overflowY: "auto" }}
              ></div>
            </List.Item>
          )}
        />
      </Card>
      <Card
        hoverable
        title="可视化预览"
        style={{ marginTop: "30px" }}
        loading={viewLoading}
      >
        <EchartBar echartData={echartBarData}></EchartBar>
      </Card>
      {/*右侧弹出框 */}
      <Drawer
        title="个人新闻统计"
        width="50%"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <EchartPie echartData={echartPieData}></EchartPie>
      </Drawer>
    </div>
  )
}
