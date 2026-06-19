import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

axios.defaults.baseURL = '/api'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const saved  = localStorage.getItem('user')
    if (token && saved) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    const { data } = await axios.post('/auth/login', { username, password })
    const { access_token, user: u } = data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(u))
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    setUser(u)
    return u
  }, [])

  // Set a user locally without calling the backend (development helper)
  const setUserLocal = useCallback(u => {
    const fakeToken = 'dev-token'
    localStorage.setItem('token', fakeToken)
    localStorage.setItem('user', JSON.stringify(u))
    axios.defaults.headers.common['Authorization'] = `Bearer ${fakeToken}`
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUserLocal }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
