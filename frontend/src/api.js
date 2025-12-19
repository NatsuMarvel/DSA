import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function authClient(){
  const token = localStorage.getItem('token')
  return axios.create({
    baseURL: API_BASE,
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  })
}

export default axios.create({ baseURL: API_BASE })
