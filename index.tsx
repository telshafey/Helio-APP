import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { DataProvider } from './context/DataContext';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { CommunityProvider } from './context/AppContext';
import { ServicesProvider } from './context/ServicesContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <UIProvider>
        <AuthProvider>
          <DataProvider>
            <CommunityProvider>
              <ServicesProvider>
                <App />
              </ServicesProvider>
            </CommunityProvider>
          </DataProvider>
        </AuthProvider>
      </UIProvider>
    </HashRouter>
  </React.StrictMode>
);