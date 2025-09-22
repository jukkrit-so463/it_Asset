import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import Dashboard from './pages/Dashboard';
import Asset from './pages/Asset';
import AssetDetail from './pages/AssetDetail';
import EditAsset from './pages/EditAsset';
import Departments from './pages/Departments';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import MyAsset from './pages/MyAsset'; // New page for users

// 1. Create Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (storedUser && token) {
          setUser(storedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error("Failed to initialize auth", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = { user, login, logout, loading };

  if (loading) {
    return <div>Loading...</div>; // Or a global spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 2. Create Protected Route Components
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user's role is not allowed, redirect them
    return user.role === 'ADMIN' ? <Navigate to="/" replace /> : <Navigate to="/my-asset" replace />;
  }

  return children;
};

// Component to handle the main redirect
const HomeRedirect = () => {
  const { user } = useAuth();
  if (user) {
    return user.role === 'ADMIN' ? <Navigate to="/dashboard" /> : <Navigate to="/my-asset" />;
  }
  return <Navigate to="/login" />;
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomeRedirect />} />

          <Route element={<Layout />}>
            {/* Admin Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute allowedRoles={['ADMIN']}><Asset /></ProtectedRoute>} />
            <Route path="/edit-asset/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><EditAsset /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute allowedRoles={['ADMIN']}><Departments /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><Reports /></ProtectedRoute>} />
            
            {/* User Routes */}
            <Route path="/my-asset" element={<ProtectedRoute allowedRoles={['USER']}><MyAsset /></ProtectedRoute>} />

            {/* Common Protected Routes */}
            <Route path="/assets/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'USER']}><AssetDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['ADMIN', 'USER']}><Profile /></ProtectedRoute>} />
          </Route>
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;