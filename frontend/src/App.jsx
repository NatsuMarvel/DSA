import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Topics from './pages/Topics'
import Admin from './pages/Admin'
import { authClient } from './api'

function App(){
  const token = localStorage.getItem('token')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadUser(){
      if (!token) return
      try {
        const client = authClient()
        const res = await client.get('/auth/me')
        setUser(res.data)
      } catch (err) {
        console.warn('Could not fetch user', err)
      }
    }
    loadUser()
  }, [token])

  return (
    <div>
      <header className="header">
        <div className="inner">
          <div className="brand"><div className="logo">DS</div> DSA Sheet</div>
          <div className="nav">
            <Link to="/topics">Topics</Link>
            {token ? (
              <>
                {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
                <span className="user">{user ? user.name : 'You'}</span>
                <button className="btn btn-ghost" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/topics" element={token ? <Topics /> : <Navigate to="/login" />} />
        <Route path="/admin" element={token && user?.role === 'admin' ? <Admin /> : <Navigate to="/topics" />} />
        <Route path="/" element={<Navigate to="/topics" />} />
      </Routes>
    </div>
  )
}

export default App
