import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router.jsx';
import './index.css';

// Module 3 demo entry point. The whole router config lives in router.jsx —
// main.jsx just hands it to <RouterProvider>. This is the canonical RR v7
// data-router pattern.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
