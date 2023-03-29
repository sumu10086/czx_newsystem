import { createSlice } from "@reduxjs/toolkit"
export const topHeaderSlice = createSlice({
  name: "topHeader",
  initialState: {
    topCollapsed: false,
    userInfo: {}
  },
  reducers: {
    changeTopCollapsed: (state, action) => {
      console.log(action)
      state.topCollapsed = !state.topCollapsed
    },
    changeUserInfo: (state, action) => {
      if (
        JSON.parse(localStorage.getItem("userInfo")).user.mobile ===
        action.payload.user.mobile
      ) {
        localStorage.setItem("userInfo", JSON.stringify(action.payload))
      }
      state.userInfo = action.payload
    }
  }
})
export const { changeTopCollapsed, changeUserInfo } = topHeaderSlice.actions
export default topHeaderSlice.reducer
