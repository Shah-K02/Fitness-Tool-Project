import React, { useState } from "react";
import SearchResultList from "./SearchResultsList";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    try {
      // Make sure this URL matches your backend route
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
        throw new Error("Search failed");
      }

      const data = await response.json();
      console.log(data);
      setResults(data.foods);
    } catch (error) {
      console.error("Error during the search:", error);
      setResults([]); // Reset results or handle the error as needed
    }
  };

  return (
    <div className="food-search-container">
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
