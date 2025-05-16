import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function MainPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch results');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Something went wrong while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      <h1 className="text-5xl font-bold text-indigo-600 mt-10 mb-8">ViteFait</h1>

      <form onSubmit={handleSearch} className="w-full max-w-xl mb-6">
        <input
          type="text"
          placeholder="Search for a product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="w-full max-w-xl mt-4">
        {results.map((item, i) => (
          <li key={i} className="mb-6 border-b pb-4">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {item.name}
            </a>
            <p className="text-gray-700">{item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
