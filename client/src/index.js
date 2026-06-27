import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// React 17 uses ReactDOM.render (not createRoot). If you switch this app to
// React 18 per the project toggle, change this to createRoot and guard
// effects against StrictMode double-invocation.
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
