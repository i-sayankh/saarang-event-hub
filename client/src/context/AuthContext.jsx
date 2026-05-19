import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(null)
  const [user, setUser]     = useState(null)

  const login = (token, user) => {
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)