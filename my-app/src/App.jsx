// App.jsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const userName = localStorage.getItem('name')
  const userEmail = localStorage.getItem('email')
  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const justLoggedIn = params.get('welcome')

    if (justLoggedIn && userName) {
      setWelcomeMessage(`Hey ${userName}, welcome to ViteFait`)
      const timer = setTimeout(() => setWelcomeMessage(''), 10000)
      return () => clearTimeout(timer)
    }
  }, [location, userName])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Failed to fetch results')
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      setError('Something went wrong while fetching data.')
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async (item) => {
    if (!isLoggedIn) {
      alert('You need to log in to add favorites.')
      navigate('/login')
      return
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, product: item })
      })

      const data = await res.json()
      if (data.message === 'Product already in favorites') {
        alert('This product is already in your favorites!')
      } else {
        alert('Added to favorites!')
      }
    } catch (err) {
      console.error('Failed to add favorite:', err)
      alert('Failed to add to favorites.')
    }
  }

  return (
    <div className="container py-4">
      {welcomeMessage && (
        <div className="alert alert-success text-center" role="alert">
          {welcomeMessage}
        </div>
      )}

      <div className="text-center mb-4">
        <h1 className="mb-3">ViteFait</h1>
        <form onSubmit={handleSearch} className="d-flex justify-content-center gap-2">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search for a product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {results.length > 0 && (
        <div className="row">
          {results.map((item, i) => (
            <div key={i} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-img-top"
                    style={{ objectFit: 'contain', height: '200px', width: '100%' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-title h6 text-decoration-none mb-2"
                  >
                    {item.name}
                  </a>
                  <p className="card-text mb-3">{item.price}</p>
                  <button onClick={() => handleFavorite(item)} className="btn btn-outline-primary mt-auto">
                    Add to Favorites
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
