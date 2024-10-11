import { StoreContext } from './context/StoreContext';
import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'
import './style/index.css';


ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <StoreContext>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </StoreContext>,
  )