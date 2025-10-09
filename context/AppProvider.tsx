import React from 'react';
import { DataProvider } from './DataContext';
import { UIProvider } from './UIContext';
import { AuthProvider } from './AuthContext';
import { CommunityProvider } from './AppContext';
import { ServicesProvider } from './ServicesContext';
import { PropertiesProvider } from './PropertiesContext';
import { NewsProvider } from './NewsContext';
import { UsersProvider } from './UsersContext';
import { TransportationProvider } from './TransportationContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <DataProvider>
          <UsersProvider>
            <ServicesProvider>
              <PropertiesProvider>
                <NewsProvider>
                  <CommunityProvider>
                    <TransportationProvider>
                      {children}
                    </TransportationProvider>
                  </CommunityProvider>
                </NewsProvider>
              </PropertiesProvider>
            </ServicesProvider>
          </UsersProvider>
        </DataProvider>
      </AuthProvider>
    </UIProvider>
  );
};
