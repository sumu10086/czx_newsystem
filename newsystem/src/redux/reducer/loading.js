import { createSlice } from "@reduxjs/toolkit"
export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false
  },
  reducers: {
    changeLoading: (state, action) => {
      state.loading = action.payload
      // console.log(action)
    }
  }
})

export const { changeLoading } = loadingSlice.actions
export default loadingSlice.reducer
