import React, { useState } from 'react';
import '../App.css'



const sayingData = require('../saying.json');

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedQueries, setSuggestedQueries] = useState([]);

  const handleSearch = () => {
    // Only perform search if the query is not empty
    if (searchQuery.trim() !== '') {
      // Filter sayingData.data based on the searchQuery
      const filteredResults = sayingData.data.filter(item => {
        const queryWords = searchQuery.toLowerCase().split(/\s+/);
        // Check if all words in the search query are present in the quote
        return queryWords.every(word =>
          item.quote.toLowerCase().includes(word)
        );
      });
      setSearchResults(filteredResults);
    } else {
      // Clear results if the query is empty
      setSearchResults([]);
    }
  };

  const highlightSearchTerms = (text, terms) => {
    // const lowerText = text.toLowerCase();
    const lowerTerms = terms.toLowerCase();

    let currentTermIndex = 0;
    let startHighlight = false;

    return (
      <span>
        {text.split('').map((char, index) => {
          const isMatch = char.toLowerCase() === lowerTerms[currentTermIndex];

          if (isMatch) {
            if (!startHighlight) {
              startHighlight = true;
            }
            currentTermIndex += 1;
          } else if (startHighlight) {
            startHighlight = false;
            currentTermIndex = 0;
          }

          return (
            <span key={index} className={startHighlight ? 'highlight' : ''}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  const handleInputChange = value => {
    setSearchQuery(value);
    // Reset suggested queries if the input value is empty
    if (value.trim() === '') {
      setSuggestedQueries([]);
      return;
    }
    // Generate suggested queries based on input
    const suggestions = sayingData.data
      .filter(item => item.quote.toLowerCase().startsWith(value.toLowerCase()))
      .slice(0, 5) // Limit suggestions to the first 5 matches
      .map(item => ({
        quote: item.quote,
        highlighted: highlightSearchTerms(item.quote, value),
        // truncated: item.quote.length > 100 ? item.quote.substring(0, 1) + '...' : item.quote,
      }));
    setSuggestedQueries(suggestions);
  };

  const handleSuggestionClick = suggestion => {
    setSearchQuery(suggestion.quote);
    setSearchResults([suggestion]); // Display details only for the clicked suggestion
    setSuggestedQueries([]); // Clear suggestions

  };

  const handleSubmit = event => {
    event.preventDefault();
    handleSearch();
    setSuggestedQueries([]); // Clear suggestions when submitting the form
  };

  return (
    <div className="search-container">
    <div className="search-box">
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search sayings..."
          value={searchQuery}
          onChange={e => handleInputChange(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>

    {suggestedQueries.length > 0 && (
      <div className="suggestions-list">
        {suggestedQueries.map((suggestion, index) => (
          <div
            key={index}
            className="suggestions-list-item"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion.highlighted}
          </div>
        ))}
      </div>
    )}

    {searchResults.length > 0 ? (
      <ul>
        {searchResults.map((result, index) => (
          <div key={index}>
            <p>{result.quote}</p>
            {result.author && <p>Author: {result.author}</p>}
            {/* Tags section removed from search results */}
          </div>
        ))}
      </ul>
    ) : (
      searchQuery.trim() !== '' && <p>No results found.</p>
    )}
  </div>
);
};

export default SearchPage;