import React, { useEffect, useState } from "react"
import axios from "axios"
import { useRoutes, Navigate } from "react-router-dom"
import Login from "../views/login/Login"
import NewsSandBox from "../views/sandbox/NewsSandBox"
import NotFound from "../components/notfound/NotFound"

// sandBox组件
import Home from "../views/sandbox/home/Home.js"
import UserList from "../views/sandbox/user-manage/UserList.js"
import RoleList from "../views/sandbox/right-manage/RoleList.js"
import RightList from "../views/sandbox/right-manage/RightList.js"
import NewsAdd from "../views/sandbox/news-manage/NewsAdd"
import NewsDraft from "../views/sandbox/news-manage/NewsDraft"
import NewsPreview from "../views/sandbox/news-manage/NewsPreview"
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate"
import NewsCategory from "../views/sandbox/news-manage/NewsCategory"
import Audit from "../views/sandbox/audit-manage/Audit"
import AuditList from "../views/sandbox/audit-manage/AuditList"
import Unpublished from "../views/sandbox/publish-manage/Unpublished"
import Published from "../views/sandbox/publish-manage/Published"
import Sunset from "../views/sandbox/publish-manage/Sunset"

// 游客路由
import News from "../views/news/News"
import Detail from "../views/news/Detail"

export default function IndexRouter() {
  const [routerMap, setrouterMap] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get("/api/sys/rightList"),
      axios.get("/api/sys/childrenList")
    ]).then((res) => {
      setrouterMap([...res[0].data.data, ...res[1].data.data])
      // console.log([...res[0].data.data, ...res[1].data.data])
    })
  }, [])

  const staticRoutes = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
  }

  const checkRoute = (item) => {
    return (staticRoutes[item.key] && item.pagepermisson) || item.routepermisson
  }
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const checkUserPagepermisson = (item) => {
    return userInfo?.role.rights.includes(item.key)
  }

  const routes = useRoutes([
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/",
      element: (
        <AuthComponent>
          <NewsSandBox />
        </AuthComponent>
      ),
      children: [
        {
          path: "/",
          element: <Navigate to="home" />
        },
        ...routerMap.map((item) => {
          if (checkRoute(item) && checkUserPagepermisson(item)) {
            return {
              path: item.key,
              element: staticRoutes[item.key]
            }
          } else {
            return {
              path: item.key,
              element: <NotFound />
            }
          }
        }),
        {
          path: "*",
          element: routerMap.length && <NotFound />
        }
      ]
    },
    // 游客路由
    {
      path: "/news",
      element: <News></News>
    },
    {
      path: "/detail/:id",
      element: <Detail></Detail>
    },
    {
      path: "*",
      element: <NotFound />
    }
  ])
  return routes
}

function AuthComponent({ children }) {
  const token = localStorage.getItem("token")
  // console.log(children)
  return token ? children : <Navigate to="/login" />
}
