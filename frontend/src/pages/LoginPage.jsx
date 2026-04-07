import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setToken } from '../services/api'

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const data = await login(formData)

    if (data.access) {
      setToken(data.access)
      navigate('/')
    } else {
      setError('Login failed')
    }
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <p className="eyebrow">Welcome back</p>
        <h2 className="section-title">Log in to continue</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="search-input"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            className="search-input"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="button button-primary" type="submit">Login</button>
        </form>

        {error && <p className="status-error">{error}</p>}
      </div>
    </main>
  )
}

export default LoginPage