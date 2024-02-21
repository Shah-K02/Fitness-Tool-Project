import React from "react";

export const searchBar = () => {
  return (
    <div className="search-container">
      <form
        className="search-form"
        onSubmit={(event) => event.preventDefault()}
        role="search"
      >
        <label htmlFor="search">Search for stuff</label>
        <input
          id="search"
          type="search"
          placeholder="Search..."
          autoFocus
          required
        />
        <button type="submit">Go</button>
      </form>
    </div>
  );
};
