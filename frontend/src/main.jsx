import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import ManageRooms from './pages/ManageRooms';
import ManageResources from './pages/ManageResources';
import ApproveBookings from './pages/ApproveBookings';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/admin/rooms" element={<ProtectedRoute adminOnly><ManageRooms /></ProtectedRoute>} />
            <Route path="/admin/resources" element={<ProtectedRoute adminOnly><ManageResources /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute adminOnly><ApproveBookings /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
