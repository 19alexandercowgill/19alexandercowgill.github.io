// Function to load the index
async function loadIndex() {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = 'Loading Pages...';

  const response = await fetch('pages.json');
  const data = await response.json();
  return data;
}

// Function to initialize Fuse.js and search
function search(query, index) {
  const options = {
      keys: ['title', 'description', 'content'], // Fields to search in
      includeScore: true, // Include match scores
      threshold: 0.3, // Adjust for fuzzy matching sensitivity
  };
  
  const fuse = new Fuse(index, options);
  return fuse.search(query).map(result => ({
      ...result.item,
      score: (1 - result.score).toFixed(2) // Convert score to a 0-1 match strength
  }));
}

// Function to display the search results
function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
      resultsContainer.innerHTML = 'No results found';
  } else {
      results.forEach(result => {
          const resultElement = document.createElement('div');
          resultElement.innerHTML = `
              <h3>${result.title}</h3>
              <p>${result.description}</p>
              <p><strong>Relevance:</strong> ${result.score}</p>
              <p><a href="${result.url}">Go to page</a></p>
          `;
          resultsContainer.appendChild(resultElement);
      });
  }
}

// Function to handle the search box and URL query
function handleSearch(index) {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');

  const searchBoxContainer = document.getElementById('search-box-container');
  searchBoxContainer.innerHTML = `
      <input type="text" id="search-box" placeholder="Search..." />
      <button id="search-button">Search</button>
  `;
  
  const searchBox = document.getElementById('search-box');
  if (query) {
      searchBox.value = query; // Set the input box to the searched query
  }

  document.getElementById('search-button').addEventListener('click', function() {
      const searchQuery = searchBox.value.trim();
      if (searchQuery) {
          window.location.search = `?q=${encodeURIComponent(searchQuery)}`;
      }
  });

  searchBox.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          const searchQuery = searchBox.value.trim();
          if (searchQuery) {
              window.location.search = `?q=${encodeURIComponent(searchQuery)}`;
          }
      }
  });

  if (query) {
      const results = search(query, index);
      displayResults(results);
  }
  searchBox.focus();
}

// Wait until the page is loaded to initialize the search
document.addEventListener('DOMContentLoaded', async function() {
  const index = await loadIndex();
  handleSearch(index);
});
