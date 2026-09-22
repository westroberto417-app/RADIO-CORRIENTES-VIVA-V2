if (typeof window !== 'undefined') {
  (window as unknown as { $RefreshReg$?: () => void; $RefreshSig$?: () => (type: unknown) => unknown }).$RefreshReg$ =
    (window as unknown as { $RefreshReg$?: () => void }).$RefreshReg$ || (() => {});
  (window as unknown as { $RefreshSig$?: () => (type: unknown) => unknown }).$RefreshSig$ =
    (window as unknown as { $RefreshSig$?: () => (type: unknown) => unknown }).$RefreshSig$ || (() => (type: unknown) => type);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Registrar Service Worker para soporte PWA e instalación WebAPK
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Radio Corrientes Viva PWA - Service Worker activo:', registration.scope);
      })
      .catch((error) => {
        console.warn('Error al registrar Service Worker:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
