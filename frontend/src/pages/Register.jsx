import React, { useState } from 'react'
import axios from '../api'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function submit(e){
    e.preventDefault()
    try {
      const res = await axios.post('/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      window.location.href = '/topics'
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="form-card">
      <div className="card">
        <h2>Register</h2>
        <form onSubmit={submit}>
          <div>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn">Register</button>
          {error && <div className="alert-error">{error}</div>}
        </form>
        <p className="helper" style={{marginTop:12}}>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  )
}
