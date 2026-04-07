import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../services/api'

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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

    const data = await signup(formData)

    if (data.id) {
      navigate('/login')
    } else {
      setError('Signup failed')
    }
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <p className="eyebrow">Get started</p>
        <h2 className="section-title">Create your account</h2>

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
            name="email"
            placeholder="Email"
            value={formData.email}
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
          <button className="button button-primary" type="submit">Sign Up</button>
        </form>

        {error && <p className="status-error">{error}</p>}
      </div>
    </main>
  )
}

export default SignupPage