import React from "react"
import ReactDom from "react-dom/client"
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css" 
import "./admin/styles/admin.css";
import "./styles/custom.css"
import './styles/main.css'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
