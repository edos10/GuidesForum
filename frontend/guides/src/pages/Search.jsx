import React, { useState } from 'react';
import "./Search.css"

function Search() {
  const [query, setQuery] = useState('');
  const [guides, setGuides] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        const data = await response.json();
        setGuides(data);
      } else {
        console.error('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Request failed with error:', error);
    }
  };

  return (
    <div className="search-container">
      <h1>Поиск по тегам</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-container">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input-text"
            placeholder="Введите запрос"
          />
          <button type="submit" className="submit-button">Поиск</button>
        </div>
      </form>
      <div>
        {guides.length > 0 ? (
          <ul className="guide-list">
            {guides.map((guide) => (
              <li key={guide.id} className="guide-item">
                <h2>
                  <a href={`/guide/${guide.id}`}>{guide.title}</a>
                </h2>
                <ul className="tag-list">
                  {guide.tags.map((tag) => (
                    <li key={tag[0]}>{tag[0]} - Rating: {tag[1]}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No guides found.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
