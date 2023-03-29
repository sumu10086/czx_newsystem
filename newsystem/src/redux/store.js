import { configureStore, combineReducers } from "@reduxjs/toolkit"
// persist
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
// 创建的reducer
import topHeaderSliceReducer from "./reducer/topHeaderReducer"
import loadingSliceReducer from "./reducer/loading"
// combineReducers合并reducer
const reducers = combineReducers({
  topHeaderSliceReducer,
  loadingSliceReducer
})
const persistConfig = {
  key: "czxPersist",
  storage, // defaults to localStorage for web
  // 黑名单 不缓存的
  // blacklist: ["page404"],
  // 白名单 缓存
  whitelist: ["topHeaderSliceReducer"]
}
const persistedReducer = persistReducer(persistConfig, reducers)
const store = configureStore({
  reducer: persistedReducer,
  // devTools: process.env.NODE_ENV !== "production"
  // middleware: [thunk],
  // 解决redux-toolkit 报无法序列化Warning A non-serializable value was detected in an action  插件问题
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
export default store
