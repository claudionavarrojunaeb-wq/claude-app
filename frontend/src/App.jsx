import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute  from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import Login           from './pages/Login'
import DashboardHome from './pages/DashboardHome'
import Analytics    from './pages/Analytics'
import Users        from './pages/Users'
import Projects     from './pages/Projects'
import Reports      from './pages/Reports'
import Settings     from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index          element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users"     element={<Users />} />
            <Route path="projects"  element={<Projects />} />
            <Route path="reports"   element={<Reports />} />
            <Route path="settings"  element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
