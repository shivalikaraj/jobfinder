import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from "react-redux"
import store from './store/store.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
        />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
