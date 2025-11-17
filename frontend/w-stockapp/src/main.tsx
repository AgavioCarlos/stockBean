import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Persona from './pages/Persona/Persona'
import Home from './pages/Home'
import Login from './pages/Login/Login';
import Perfil from './pages/Perfil';
import Categorias from './pages/Categorias';
import Roles from './pages/Roles';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos'
import Marcas from './pages/Marcas'
import Clientes from './pages/Clientes'
import Proveedores from './pages/Proveedores'
import PuntoVenta from './pages/PuntoVenta'
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Inicio/>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/perfil",
    element: (
      <ProtectedRoute>
        <Perfil />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
    {
    path: "/productos",
    element: (
      <Productos/>
    ),
  },
  {
    path: "/persona",
    element: (
      <ProtectedRoute>
        <Persona />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categorias",
    element: (
      <ProtectedRoute>
        <Categorias />
      </ProtectedRoute>
    ),
  },
  {
    path: "/roles",
    element: (
      <ProtectedRoute>
        <Roles />
      </ProtectedRoute>
    ),
  },
  {
    path: "/marcas",
    element: (
      <ProtectedRoute>
        <Marcas/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/clientes",
    element: (
      <ProtectedRoute>
        <Clientes/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/proveedores",
    element: (
      <ProtectedRoute>
        <Proveedores/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/punto-venta",
    element: (
      <ProtectedRoute>
        <PuntoVenta/>
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Login />
    <Persona /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
);