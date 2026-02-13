import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './hooks/useLanguage';
import Layout from './v2/layout/Layout';
import { initTelemetry } from './utils/telemetry';

// Initialize Telemetry
initTelemetry();

// Mount the React app to a div with id "react-root" that we'll add to the HTML
const rootElement = document.getElementById('react-root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LanguageProvider>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the react-root element');
}
