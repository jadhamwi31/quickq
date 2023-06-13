import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MenuStylesContextProvider } from './context/menuStylesContext';
import { CategoriesContextProvider } from './context/categoriesContext';
import { TabelContextProvider } from './context/tableContext';
import { ActiveMenuContextProvider } from './context/ActiveMenuContext';
import { OrderContextProvider } from './context/orderContext';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <OrderContextProvider>
      <ActiveMenuContextProvider>
        <MenuStylesContextProvider>
          <TabelContextProvider>
            <CategoriesContextProvider>

              <App />

            </CategoriesContextProvider>
          </TabelContextProvider>
        </MenuStylesContextProvider>
      </ActiveMenuContextProvider>
    </OrderContextProvider>
  </React.StrictMode>
);
