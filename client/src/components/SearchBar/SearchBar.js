import "./SearchBar.css";

import React, { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await fetch("/api/food/search", {
        // Assuming '/api/food/search' is your backend endpoint for the USDA search
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include any other necessary headers, like authentication tokens
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.foods); // Adapt based on the actual structure of the response
    } catch (error) {
      console.error("Error during the search:", error);
      setResults([]); // Reset results or handle the error as needed
    }
  };

  return (
    <div className="food-search-container">
      {" "}
      {/* Use a class that your CSS already styles */}
      <form onSubmit={handleSearch} className="search-form">
        {" "}
        {/* Assuming your CSS styles forms with this class */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for food..."
          className="search-input" // Assuming this is styled by your CSS
        />
        <button type="submit" className="search-button">
          Go
        </button>{" "}
        {/* And this button */}
      </form>
      <div className="search-results">
        {results.length > 0 && (
          <ul className="results-list">
            {results.map((food, index) => (
              <li key={index} className="result-item">
                {food.description} - Calories: {food.nutrients[0].value}{" "}
                {/* Example, adjust based on actual data */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
