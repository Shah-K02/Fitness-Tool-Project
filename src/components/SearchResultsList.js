import React from "react";
import "./SearchResultsList";
import SearchResult from "./SearchResult";

const SearchResultList = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result} key={id} />;
      })}
    </div>
  );
};

export default SearchResultList;
