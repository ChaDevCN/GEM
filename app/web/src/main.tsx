import { BrowserRouter, useRoutes } from "react-router-dom"
import ReactDOM from 'react-dom/client'

import router from "./router"

import 'uno.css'
import './index.css'

const App = () => useRoutes(router)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
