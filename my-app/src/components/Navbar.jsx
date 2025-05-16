import { Link, useNavigate } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/?logout=true')
  }
  

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>ViteFait</Link>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/favorites" style={{ marginRight: '1rem' }}>
              <FaHeart size={20} />
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
