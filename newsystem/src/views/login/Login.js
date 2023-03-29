import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// 粒子化
import Particles from "react-particles"
import { loadFull } from "tsparticles"
// css
import "./Login.scss"
// antd
import {
  LockOutlined,
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined
} from "@ant-design/icons"
import { Button, Checkbox, Form, Input, message } from "antd"
export default function Login() {
  const [loading, setloading] = useState(false)
  const navigator = useNavigate()
  const onFinish = (values) => {
    setloading(true)
    // console.log("Success:", values)
    axios
      .post("/api/sys/login", values)
      .then((res) => {
        // console.log(res)
        switch (res.data.code) {
          case "200":
            localStorage.setItem("token", res.data.data._token)
            // values.remember
            //   ? localStorage.setItem("remember", ...values)
            //   : localStorage.removeItem("remember")
            axios
              .get(
                // 携带token提交后台进行token验证
                `/api/sys/userinfo?token=${res.data.data._token}`
              )
              .then((result) => {
                // token验证就成功把个人信息存到本地
                // console.log(result.data.info2)
                localStorage.setItem(
                  "userInfo",
                  JSON.stringify(result.data.info2.userInfo)
                )
                // console.log(result.data.info2.userInfo)
                //如果权限打开则放行  登录成功
                if (result.data.info2.userInfo.user.roleState) {
                  message.success(res.data.info, [1])
                  navigator("/home")
                } else {
                  // 没有打开权限则提示登录为授权
                  message.warning("登录未授权", [3])
                }
              })
              .catch((err) => {
                // 否则登录过期token失效,重新跳回login登录
                message.warning("登录过期，请重新登录", [3])
                navigator("/login")
              })

            break
          case "4399":
            message.error(res.data.info, [3])
            break
          default:
            message.warning(res.data.info, [3])
            break
        }
        setTimeout(() => {
          setloading(false)
        }, 500)
      })
      .catch((err) => {
        message.warning("服务器异常，请稍后再试", [3])
        setTimeout(() => {
          setloading(false)
        }, 500)
      })
  }
  const onFinishFailed = (errorInfo) => {
    setloading(true)
    // console.log("Failed:", errorInfo)
    message.info("请完善账户密码", [3])
    setTimeout(() => {
      setloading(false)
    }, 500)
  }
  /**
   * 粒子化配置
   */
  const particlesInit = useCallback(async (engine) => {
    // console.log(engine)
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container)
  }, [])
  const options = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push"
        },
        onHover: {
          enable: true,
          mode: "repulse"
        },
        resize: true
      },
      modes: {
        push: {
          quantity: 4
        },
        repulse: {
          distance: 150,
          duration: 10
        }
      }
    },
    particles: {
      color: {
        value: "#ffffff"
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1
      },
      collisions: {
        enable: true
      },
      move: {
        directions: "none",
        enable: true,
        outModes: {
          default: "bounce"
        },
        random: false,
        speed: 2,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 1200
        },
        value: 80
      },
      opacity: {
        value: 0.5,
        anim: {
          enable: true, //渐变动画
          speed: 1, //渐变动画速度
          opacity_min: 1, //渐变动画不透明度
          sync: false
        }
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 6 },
        random: true, //  原子大小随机
        anim: {
          enable: false, //原子渐变
          speed: 1, //原子渐变速度
          size_min: 0.1,
          sync: false
        }
      }
    },
    detectRetina: true
  }
  /**
   * 粒子化配置
   */
  return (
    <div className="login ">
      <div className="loginTop">
        {/* 占位 */}
        <div></div>
      </div>
      {/*  粒子化 */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={options}
      />
      <div className="content login-container">
        <div className="titleMsg ">苏沐新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: "请输入你的账号!"
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="账号"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "请输入你的密码!"
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="密码"
              allowClear
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            style={{ width: "100%", textAlign: "right" }}
          >
            <Form.Item>
              <Checkbox style={{ color: "#fff" }}>记住密码</Checkbox>
              {/* <a className="login-form-forgot" href="">
              忘记密码
            </a> */}
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: "100%", height: "40px" }}
                className="login-submit "
              >
                登录
              </Button>
              {/* <a href="">去注册!</a> */}
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
