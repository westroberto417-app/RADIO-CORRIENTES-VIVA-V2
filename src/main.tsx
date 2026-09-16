if (typeof window !== 'undefined') {
  (window as unknown as { $RefreshReg$?: () => void; $RefreshSig$?: () => (type: unknown) => unknown }).$RefreshReg$ =
    (window as unknown as { $RefreshReg$?: () => void }).$RefreshReg$ || (() => {});
  (window as unknown as { $RefreshSig$?: () => (type: unknown) => unknown }).$RefreshSig$ =
    (window as unknown as { $RefreshSig$?: () => (type: unknown) => unknown }).$RefreshSig$ || (() => (type: unknown) => type);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

registerSW({immediate: true});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
