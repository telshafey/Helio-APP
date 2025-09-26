import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { DataProvider } from './context/DataContext';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { CommunityProvider } from './context/AppContext';

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
          <ChatProvider>
            <DataProvider>
              <CommunityProvider>
                <App />
              </CommunityProvider>
            </DataProvider>
          </ChatProvider>
        </AuthProvider>
      </UIProvider>
    </HashRouter>
  </React.StrictMode>
);