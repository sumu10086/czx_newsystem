import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import style from "./news.module.scss"
import { Col, Row, Card, Button } from "antd"
export default function News() {
  const [newsList, setnewsList] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let matchStr = JSON.stringify({
      publishState: 2
    })
    let sortStr = JSON.stringify({
      // 倒序排序
      publishTime: -1
    })
    axios
      .get(`/api/sys/newsList?matchStr=${matchStr}&&sortStr=${sortStr}`)
      .then((res) => {
        // console.log(res.data.data)
        setnewsList(res.data.data)
        setLoading(false)
      })
  }, [])

  const navigate = useNavigate()
  return (
    <div>
      <h1 className={style.top}>
        新闻阅读中心
        <Button type="dashed" onClick={() => navigate("/")}>
          去首页
        </Button>
      </h1>
      <Row gutter={[16, 16]} style={{ padding: "20px" }}>
        {newsList.map((item) => (
          <Col span={8} key={item._id}>
            <Card
              title={item.categorie.title}
              extra={<a href={`#/detail/${item._id}`}>点击查看详细新闻</a>}
              loading={loading}
              hoverable
            >
              <div className={style.title}>
                <span> 标题：</span>
                <span>{item.title}</span>
              </div>
              <div className={style.content}>
                <p> 内容：</p>
                <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
