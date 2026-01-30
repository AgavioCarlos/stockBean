import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Persona from './pages/Persona/Persona'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login/Login';
import Perfil from './pages/Perfil';
import Categorias from './pages/Categorias';
import Unidades from './pages/Unidades'
import Roles from './pages/Roles';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos'
import Marcas from './pages/Marcas'
import Clientes from './pages/Clientes'
import Proveedores from './pages/Proveedores'
import PuntoVenta from './pages/PuntoVenta'
import ProtectedRoute from "./components/ProtectedRoute";
import Configuracion from './pages/Configuracion';
import Catalogos from './pages/Catalogos';
import Administrador from './pages/Administrador';
import Sucursales from './pages/Sucursales';
import Usuarios from './pages/Usuarios';
import UsuariosSucursales from './pages/UsuariosSucursales';
import Inventario from './pages/Inventario';
import HistorialPrecios from './pages/HistorialPrecios';
import Empresas from './pages/Empresas';
import EmpresaUsuario from './pages/EmpresaUsuario';
import TestData from './pages/TestData';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Inicio />
    ),
  },
  {
    path: "/home",
    element: (<ProtectedRoute><Home /></ProtectedRoute>),
  },
  {
    path: "/dashboard",
    element: (<ProtectedRoute><Dashboard /></ProtectedRoute>)
  },
  {
    path: "/catalogos",
    element: (<ProtectedRoute><Catalogos /></ProtectedRoute>)
  },
  {
    path: "/configuracion",
    element: (<ProtectedRoute><Configuracion /></ProtectedRoute>)
  },
  {
    path: "/perfil",
    element: (<ProtectedRoute><Perfil /></ProtectedRoute>)
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/productos",
    element: (<ProtectedRoute><Productos /></ProtectedRoute>)
  },
  {
    path: "/persona",
    element: (<ProtectedRoute><Persona /></ProtectedRoute>)
  },
  {
    path: "/categorias",
    element: (<ProtectedRoute><Categorias /></ProtectedRoute>)
  },
  {
    path: "/unidades",
    element: (<ProtectedRoute><Unidades /></ProtectedRoute>)
  },
  {
    path: "/roles",
    element: (<ProtectedRoute><Roles /></ProtectedRoute>)
  },
  {
    path: "/marcas",
    element: (<ProtectedRoute><Marcas /></ProtectedRoute>)
  },
  {
    path: "/clientes",
    element: (<ProtectedRoute><Clientes /></ProtectedRoute>)
  },
  {
    path: "/proveedores",
    element: (<ProtectedRoute><Proveedores /></ProtectedRoute>)
  },
  {
    path: "/punto-venta",
    element: (<ProtectedRoute><PuntoVenta /></ProtectedRoute>)
  },
  {
    path: "/administrador",
    element: (<ProtectedRoute><Administrador /></ProtectedRoute>)
  },
  {
    path: "/sucursales",
    element: (<ProtectedRoute><Sucursales /></ProtectedRoute>)
  },
  {
    path: "/usuarios",
    element: (<ProtectedRoute><Usuarios /></ProtectedRoute>)
  },
  {
    path: "/usuarios-sucursales",
    element: (<ProtectedRoute><UsuariosSucursales /></ProtectedRoute>)
  },
  {
    path: "/inventario",
    element: (<ProtectedRoute><Inventario /></ProtectedRoute>)
  },
  {
    path: "/historial-precios",
    element: (<ProtectedRoute><HistorialPrecios /></ProtectedRoute>)
  },
  {
    path: "/empresas",
    element: (<ProtectedRoute><Empresas /></ProtectedRoute>)
  },
  {
    path: "/empresa-usuarios",
    element: (<ProtectedRoute><EmpresaUsuario /></ProtectedRoute>)
  },
  {
    path: "/test-data",
    element: (<ProtectedRoute><TestData /></ProtectedRoute>)
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Login />
    <Persona /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
);