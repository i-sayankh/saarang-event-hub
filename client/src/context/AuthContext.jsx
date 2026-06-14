import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

// Decode a JWT payload without verifying the signature (client-side only).
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

// A token is usable only if it decodes and its exp claim is in the future.
const isTokenValid = (token) => {
  const payload = parseJwt(token)
  if (!payload || !payload.exp) return false
  return payload.exp * 1000 > Date.now()
}

// Read persisted auth, discarding it if the token is missing or expired.
const loadAuth = () => {
  const token = localStorage.getItem('token')
  if (!token || !isTokenValid(token)) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { token: null, user: null }
  }
  const stored = localStorage.getItem('user')
  return { token, user: stored ? JSON.parse(stored) : null }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(() => loadAuth().token)
  const [user, setUser]     = useState(() => loadAuth().user)

  const login = (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    window.location.href = '/'
  }

  // Auto-logout the moment the active token expires.
  useEffect(() => {
    if (!token) return
    const payload = parseJwt(token)
    if (!payload?.exp) {
      logout()
      return
    }
    const msUntilExpiry = payload.exp * 1000 - Date.now()
    if (msUntilExpiry <= 0) {
      logout()
      return
    }
    const timer = setTimeout(logout, msUntilExpiry)
    return () => clearTimeout(timer)
  }, [token])

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)