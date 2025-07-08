import React, { useState } from "react";
import SearchResultList from "./SearchResultsList";
import "./SearchBar.css";
import ErrorMessage from "../ErrorMessage";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [errorTimestamp, setErrorTimestamp] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/food/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        throw new setError("Search failed");
      }

      const data = await response.json();
      setResults(data.foods);
    } catch (error) {
      setError("Error during the search:", error);
      setErrorTimestamp(Date.now());
      setResults([]); // Clear the results
    }
  };

  return (
    <div className="food-search-container">
      <ErrorMessage message={error} timestamp={errorTimestamp} />
      <form onSubmit={handleSearch} className="search-form">
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for food..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Go
        </button>
      </form>

      {results.length > 0 && <SearchResultList results={results} />}
    </div>
  );
}

export default SearchBar;
