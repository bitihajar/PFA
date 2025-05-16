import { useEffect, useState } from 'react';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const email = localStorage.getItem('email');

  // Fetch favorites on component mount
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`/api/favorites?email=${email}`);
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const data = await res.json();
        setFavorites(data || []);
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }

    if (email) fetchFavorites();
  }, [email]);

  // Add to favorites handler
  const handleAddFavorite = async (product) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product }),
      });
      
      if (!res.ok) throw new Error('Failed to add favorite');
      
      const data = await res.json();
      if (data.message === 'Product already in favorites') {
        alert('This product is already in your favorites!');
      } else {
        alert('Added to favorites!');
        // Refresh the favorites list
        const newFavs = await fetch(`/api/favorites?email=${email}`);
        setFavorites(await newFavs.json());
      }
    } catch (err) {
      console.error('Failed to add favorite:', err);
      alert(err.message);
    }
  };

  // Remove from favorites handler
  const handleRemove = async (product) => {
    try {
      const res = await fetch('/api/favorites/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product }),
      });
      
      if (!res.ok) throw new Error('Failed to remove favorite');
      
      setFavorites(favorites.filter((f) => f.name !== product.name));
      alert('Removed from favorites!');
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert(err.message);
    }
  };

  // Example product component with Add to Favorites button
  function Product({ product }) {
    return (
      <div className="col mb-4">
        <div className="card h-100">
          <img src={product.image} className="card-img-top" alt={product.name} />
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.price}</p>
            <button 
              onClick={() => handleAddFavorite(product)}
              className="btn btn-primary"
            >
              Add to Favorites
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Your Favorites</h2>
      
      {favorites.length === 0 ? (
        <p className="text-center">No favorite products yet.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {favorites.map((product, idx) => (
            <div className="col" key={idx}>
              <div className="card h-100 shadow-sm">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">
                    <a href={product.link} target="_blank" rel="noopener noreferrer">
                      {product.name}
                    </a>
                  </h5>
                  <p className="card-text">{product.price}</p>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleRemove(product)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;