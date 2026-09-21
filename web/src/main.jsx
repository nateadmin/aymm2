import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initMobilePreview } from '@/lib/mobilePreview';
import { initStagingPreview } from '@/lib/stagingPreview';
import { initKeyboardViewport } from '@/lib/keyboardViewport';
import './index.css';

initStagingPreview();
initMobilePreview();
initKeyboardViewport();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
