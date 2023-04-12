import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,



} from 'react-router-dom'

import RootLayout from './layout/RootLayout';
import './App.css';
import Index from './pages/Home/Index'
import Tabels from './pages/admin/Tabels';
import Menu from './pages/admin/Menu';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import Accounting from './pages/admin/Accounting';
import Home from './pages/admin/Home';

const router = createBrowserRouter(



  createRoutesFromElements(<>

    <Route path="/" element={<Index />}>

    </Route>
    <Route path="/admin" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path='Tabels' element={<Tabels />} />
      <Route path='Menu' element={<Menu />} />
      <Route path='Accounting' element={<Accounting />} />
      <Route path='Inventory' element={<Inventory />} />
      <Route path='Orders' element={<Orders />} />
    </Route></>
  )
)
function App() {


  return (
    <RouterProvider router={router} />

  );
}

export default App;
