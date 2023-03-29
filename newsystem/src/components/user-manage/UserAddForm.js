import { PlusOutlined, AndroidFilled } from "@ant-design/icons"
import { Form, Input, Select, Upload, Modal } from "antd"
import ImgCrop from "antd-img-crop"
import { forwardRef, useState, useEffect } from "react"
import { client } from "../../utils/aliossupload"
const UserAddForm = (props, ref) => {
  const { Option } = Select
  const { TextArea } = Input
  const { user } = JSON.parse(localStorage.getItem("userInfo"))

  /**
   * 区域选择禁用
   */
  const checkRegionDisabled = (v) => {
    // 点击的是编辑按钮
    if (props.currentUser) {
      // console.log("编辑")
      if (user.roleId === 1) {
        return false
      } else {
        return v.value !== user.region
      }
    } else {
      // 点击的是添加按钮
      // console.log("添加")
      if (user.roleId === 1) {
        return false
      } else {
        return v.value !== user.region
      }
    }
  }
  /**
   * 区域选择禁用
   */

  /**
   * 角色选择禁用
   */
  const checkRolenDisabled = (v) => {
    // 点击的是编辑按钮
    if (props.currentUser) {
      // console.log("编辑")
      if (user.roleId === 1) {
        return false
      } else {
        return true
      }
    } else {
      // 点击的是添加按钮
      // console.log("添加")
      if (user.roleId === 1) {
        return false
      } else {
        return v.roleType !== 3
      }
    }
  }
  /**
   * 角色选择禁用
   */

  /**
   *  头像   图片上传
   */
  const [isDisabled, setisDisabled] = useState(false)

  const [fileList, setFileList] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  // setFileList 设置个人的图片
  useEffect(() => {
    let roleImg = props.currentUser.roleImg
    setFileList(
      roleImg
        ? [
            {
              uid: "1",
              name: "xxx.png",
              status: "none",
              url: roleImg,
              percent: 100
            }
          ]
        : []
    )
  }, [props.currentUser.roleImg])
  // 设置个人的图片

  // 自定义
  const customRequest = (file) => {
    // 给阿里云 对象存储上传需要 先给个图片的名字
    // console.log(file)
    // start：进度条相关
    // 伪装成 handleChange里面的图片上传状态
    let imgItem = {
      uid: "1", // 注意，这个uid一定不能少，否则上传失败
      name: "hehe.png",
      status: "uploading",
      percent: 50, // 注意不要写100。100表示上传完成
      url: ""
    }
    setFileList([imgItem])

    var filename = `newsystem-roleImg/roleImg${Date.parse(new Date())}.jpg`
    // multipartUpload 是阿里云对象存储自带的上传方法
    // 第一个参数 文件名 第二个参数 文件本身 第三个参数上传进度
    client()
      .multipartUpload(filename, file.file, {
        progress: function (percentage) {
          console.log("上传进度", percentage)
        }
      })
      .then((res) => {
        // console.log("res上传结果", res)
        let roleImg =
          "https://czxbucket1.oss-cn-hangzhou.aliyuncs.com/" + filename
        setFileList([
          {
            ...imgItem,
            percent: 100,
            status: "none",
            url: roleImg
          }
        ])
        setPreviewImage(roleImg)
        props.handlerRoleImg(roleImg)
      })
  }

  const onPreview = (file) => {
    setPreviewTitle(
      <div>
        {/* <div>{file.name}</div> */}
        图片下载链接
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a onClick={handleClickImg}>{file.url}</a>
      </div>
    )
    setPreviewOpen(true)
  }
  const onRemove = (file) => {
    setFileList([
      {
        status: "removed",
        url: ""
      }
    ])
    setPreviewImage("")
    props.handlerRoleImg("")
  }

  //上传之前 此函数可以进行 文件大小 格式校验
  const beforeUploadFn = (file) => {
    const isJPEG = file.name.split(".")[1] === "jpeg"
    const isJPG = file.name.split(".")[1] === "jpg"
    const isPNG = file.name.split(".")[1] === "png"
    const isWEBP = file.name.split(".")[1] === "webp"
    const isGIF = file.name.split(".")[1] === "gif"
    const isLt500K = file.size / 1024 / 1024 / 1024 / 1024 < 4
    if (!isJPG && !isJPEG && !isPNG && !isWEBP && !isGIF) {
      alert("上传图片只能是 JPEG/JPG/PNG 格式!")
    }
    if (!isLt500K) {
      alert("单张图片大小不能超过 4mb!")
    }
    return (isJPEG || isJPG || isPNG || isWEBP || isGIF) && isLt500K
  }

  // 图片预览弹出框
  const handleCancel = () => setPreviewOpen(false)
  function handleClickImg() {
    const image = new Image()
    image.src = previewImage
    const imgWindow = window.open(previewImage)
    imgWindow.document.write(image.outerHTML)
  }
  /**
   *  头像   图片上传
   */

  return (
    <Form
      ref={ref}
      labelCol={{
        span: 4
      }}
      wrapperCol={{
        span: 14
      }}
      layout="horizontal"
      style={{
        maxWidth: 600
      }}
    >
      <Form.Item
        name="mobile"
        label="用户名"
        rules={[{ required: true, message: "请输入用户名！" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: "请输入密码！" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisabled ? [] : [{ required: true, message: "请选择区域！" }]}
      >
        <Select disabled={isDisabled}>
          {props.regionList.map((v) => (
            <Option
              value={v.title}
              key={v._id}
              disabled={checkRegionDisabled(v)}
            >
              {/* {isDisabled ? "" : v.value} */}
              {v.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true, message: "请选择角色！" }]}
      >
        <Select
          onChange={(value) => {
            // value === 1 ? setisDisabled(true) : setisDisabled(false)
            if (value === 1) {
              setisDisabled(true)
              ref.current.setFieldsValue({
                region: ""
              })
            } else {
              setisDisabled(false)
            }
          }}
        >
          {props.roleList.map((v) => (
            <Option
              value={v.roleType}
              key={v.roleType}
              disabled={checkRolenDisabled(v)}
            >
              {v.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleMsg"
        label="详情"
        rules={[{ required: true, message: "相关介绍" }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item name="roleImg" label="头像" valuePropName="roleImg">
        <ImgCrop rotationSlider>
          <Upload
            name="roleImg"
            defaultFileList={[]}
            customRequest={customRequest}
            listType="picture-card"
            fileList={fileList}
            onPreview={onPreview}
            onRemove={onRemove}
            beforeUpload={beforeUploadFn}
            maxCount={1}
            // strokeWidth 已废弃 用size代替
            progress={{ size: 2 }}
          >
            <div>
              <PlusOutlined style={{ color: "red" }} />
              <div
                style={{
                  marginTop: 8
                }}
              >
                <p>
                  <AndroidFilled
                    style={{ fontSize: "30px", color: "skyblue" }}
                  />
                </p>
              </div>
            </div>
          </Upload>
        </ImgCrop>
      </Form.Item>
      <Form.Item>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%"
            }}
            src={previewImage}
            onClick={handleClickImg}
          />
        </Modal>
      </Form.Item>
    </Form>
  )
}

export default forwardRef(UserAddForm)
