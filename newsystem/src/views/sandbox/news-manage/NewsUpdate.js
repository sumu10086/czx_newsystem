import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
// css
import style from "./news-manage.module.scss"
// NewsEditor
import NewsEditor from "../../../components/news-manage/NewsEditor"
// antd
import {
  Typography,
  Button,
  Steps,
  theme,
  Form,
  Input,
  Select,
  notification,
  message
} from "antd"
import {
  AlertFilled,
  FrownFilled,
  LeftCircleTwoTone
  //   HighlightTwoTone,
  //   HddTwoTone
} from "@ant-design/icons"
const { Title } = Typography
const { Option } = Select

function showtime() {
  return new Date().toLocaleDateString()
}

export default function NewsUpdate() {
  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)
  const [api, contextHolder] = notification.useNotification()
  const fristFormRef = useRef(null)
  const [fristFormContent, setfristFormContent] = useState({})
  const [EditorContent, setEditorContent] = useState("")
  const [categorieList, setcategorieList] = useState([])
  useEffect(() => {
    axios.get("/api/sys/categorieList").then((res) => {
      setcategorieList(res.data.data)
      //   console.log(res.data.data)
    })
  }, [])
  const [detailNew, setdetailNew] = useState(null)
  const location = useLocation()
  const pathnameArr = location.pathname.split("/")
  let id = pathnameArr[pathnameArr.length - 1]
  useEffect(() => {
    axios.get(`/api/sys/getDetailNew?id=${id}`).then((res) => {
      //   console.log(res.data.data)
      setdetailNew(res.data.data)
      const { categoryId, title, content } = res.data.data
      fristFormRef.current.setFieldsValue({
        title,
        categoryId
      })
      setEditorContent(content)
    })
  }, [id])

  const openNotification = (
    message = "提示",
    description = "description",
    icon = <AlertFilled style={{ color: "red" }} />,
    placement = "topRight"
  ) => {
    api.info({
      message,
      description,
      icon,
      placement
    })
  }

  /**
   * 按钮
   */
  const next = () => {
    if (current === 0) {
      fristFormRef.current
        .validateFields()
        .then((content) => {
          setCurrent(current + 1)
          setfristFormContent(content)
        })
        .catch((err) => {
          openNotification("警告", "请完善基本信息")
        })
    } else {
      // console.log(EditorContent)
      if (EditorContent === "" || EditorContent.trim() === "<p></p>") {
        openNotification("警告", "新闻内容不能为空！")
      } else if (EditorContent.trim().length < 30) {
        openNotification("提示", "新闻内容过少！", <FrownFilled />)
      } else {
        setCurrent(current + 1)
      }
    }
    // openNotification("警告", "请完善新闻内容", <FrownFilled />)
  }
  const prev = () => {
    setCurrent(current - 1)
  }

  const { user } = JSON.parse(localStorage.getItem("userInfo"))
  const navigate = useNavigate()
  const handleSave = (auditState) => {
    let newsObj = {
      ...fristFormContent,
      content: EditorContent,
      region: user.region ? user.region : "全球",
      author: user.mobile,
      roleId: user.roleId,
      createTime: Date.now(),
      publishTime: 0,
      auditState: auditState,
      publishState: 0,
      star: 0,
      view: 0
    }
    let updateObj = newsObj

    axios
      .post(`/api/sys/updateNewsList`, { newsObj, id, updateObj })
      .then((res) => {
        // console.log(res)
        //   api.open({
        //     message: "通知",
        //     description: auditState
        //       ? "提示, 提交至审核成功！"
        //       : "提示,更新保存至草稿箱成功",
        //     placement: "bottomRight",
        //     icon: auditState ? <HighlightTwoTone /> : <HddTwoTone />
        //   })
        auditState
          ? message.success(" 提交至审核成功！")
          : message.success("更新保存至草稿箱成功！")
        navigate(auditState ? "/audit-manage/list" : "/news-manage/draft")
      })
  }
  /**
   * 按钮
   */

  /**
   * 内容
   */
  // FirstContent
  const FirstContent = (
    <Form
      ref={fristFormRef}
      layout="vertical"
      style={{ padding: "50px", textAlign: "left" }}
    >
      <Form.Item
        name="title"
        label="新闻标题"
        rules={[
          {
            required: true,
            message: "请填入新闻标题!"
          }
        ]}
      >
        <Input allowClear />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="新闻类型"
        rules={[
          {
            required: true,
            message: "请选择新闻类型!"
          }
        ]}
      >
        <Select placeholder="请选择你的新闻类型" allowClear>
          {categorieList.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )

  // SecondContent
  const SecondContent = (
    <NewsEditor
      getEditorContent={(content) => {
        setEditorContent(content)
      }}
      content={EditorContent}
    ></NewsEditor>
  )

  /**
   * 内容
   */

  // 步骤条配置
  const steps = [
    {
      title: "基本信息",
      content: FirstContent,
      subTitle: showtime(),
      description: "新闻标题，新闻分类"
    },
    {
      title: "新闻内容",
      content: SecondContent,
      subTitle: showtime(),
      description: "新闻主体内容"
    },
    {
      title: "新闻提交",
      content: showtime() + "--保存草稿箱or提交审核",
      subTitle: showtime(),
      description: "保存草稿箱or提交审核"
    }
  ]
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    description: item.description,
    subTitle: item.subTitle
  }))
  const contentStyle = {
    // lineHeight: "260px",
    // height: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: "16px"
  }
  // 步骤条配置

  return (
    <div style={{ padding: "20px 10px" }}>
      <Title level={2} style={{ padding: "20px 10px" }}>
        <span>
          <LeftCircleTwoTone
            style={{ fontSize: "32px" }}
            onClick={() => window.history.back(-1)}
          />
        </span>
        更改新闻 --
        <span style={{ color: "lightcoral" }}>{detailNew?.title}</span>
      </Title>
      {/* 步骤条 */}
      <Steps current={current} items={items} />
      {/* 内容区域 */}
      <div style={contentStyle}>
        <div className={current === 0 ? "" : style.hidden}>
          {steps[0].content}
        </div>
        <div className={current === 1 ? "" : style.hidden}>
          {steps[1].content}
        </div>
        <div className={current === 2 ? "" : style.hidden}>
          {steps[2].content}
        </div>
      </div>
      {/* 按钮区域 */}
      {contextHolder}
      <div
        style={{
          marginTop: 24
        }}
      >
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px"
            }}
            onClick={() => prev()}
          >
            上一步
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}

        {current === steps.length - 1 && (
          <Button onClick={() => handleSave(0)}>更新并保存至草稿箱</Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => handleSave(1)}>
            提交至审核
          </Button>
        )}
      </div>
    </div>
  )
}
