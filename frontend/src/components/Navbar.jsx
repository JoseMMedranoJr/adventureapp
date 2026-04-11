import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="site-header">
      <div className="top-bar">
        <div className="brand-block">
          <p className="brand-kicker">Adventure Tracker</p>
          <h1 className="brand-title">Find your next local adventure.</h1>
        </div>

      <nav className="header-actions">
        <Link to="/home" className="button button-primary">Home</Link>

        {token && (
          <Link to="/saved" className="button button-primary">Saved</Link>
        )}

        {token ? (
          <button onClick={handleLogout} className="button button-primary">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="button button-light">Login</Link>
            <Link to="/signup" className="button button-primary">Sign Up</Link>
          </>
        )}
      </nav>
      </div>
    </header>
  )
}

export default Navbar