import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Budget from './pages/Budget.jsx';
import CreateTrip from './pages/CreateTrip.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EditTrip from './pages/EditTrip.jsx';
import Expenses from './pages/Expenses.jsx';
import NotFound from './pages/NotFound.jsx';
import TripDetails from './pages/TripDetails.jsx';
import Trips from './pages/Trips.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/new" element={<CreateTrip />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/trips/:id/edit" element={<EditTrip />} />
            <Route path="/trips/:id/budget" element={<Budget />} />
            <Route path="/trips/:id/expenses" element={<Expenses />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

