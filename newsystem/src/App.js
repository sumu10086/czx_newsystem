import { HashRouter as Router } from "react-router-dom"
import "./App.css"
// Routes
import Routes from "./router/indexRouter"
// redux
import { Provider } from "react-redux"
import store from "./redux/store"
// persist
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
let persistor = persistStore(store)

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
