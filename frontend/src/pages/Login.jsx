import React, { useState } from 'react'
import axios from '../api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function submit(e){
    e.preventDefault()
    try {
      const res = await axios.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      window.location.href = '/topics'
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="form-card">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <div>
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn">Login</button>
          {error && <div className="alert-error">{error}</div>}
        </form>
        <p className="helper" style={{marginTop:12}}>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  )
}
