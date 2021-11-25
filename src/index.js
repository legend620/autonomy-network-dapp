import React from 'react'
import ReactDOM from 'react-dom'
import { DAppProvider } from '@usedapp/core'

import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={{}}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
