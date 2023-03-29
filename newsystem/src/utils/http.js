import axios from "axios"
// nprogress
import NProgress from "nprogress"
import "nprogress/nprogress.css"
// 加载loading
// import store from "../redux/store"
axios.defaults.baseURL = "http://127.0.0.1:8888" // 本地
axios.interceptors.request.use(
  function (config) {
    // 请求前拦截
    // NProgress 加载进度条
    NProgress.start()
    // 加载loading
    // store.dispatch({
    //   type: "loading/changeLoading",
    //   payload: true
    // })
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
  },
  function (error) {}
)

axios.interceptors.response.use(
  function (response) {
    // 响应前拦截
    // NProgress 关闭进度条
    NProgress.done()
    // 关闭loading
    // store.dispatch({
    //   type: "loading/changeLoading",
    //   payload: false
    // })
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
