import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './taskpane.css';

/* global document, Office */

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

Office.onReady(() => {
  root.render(<App />);
});
