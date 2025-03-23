// Function to load the index (you can replace this with your actual index loading logic)
async function loadIndex() {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = 'Loading Pages...'; // Clear any previous results
  
    const response = await fetch('pages.json'); // Assuming your index is in a file called index.json
    const data = await response.json();
    return data;
  }
  
  // Function to search through the index
  function search(query, index) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const results = index.map(page => {
      let score = 0;
  
      queryWords.forEach(word => {
        // Check for matches in content, title, and description
        if (page.content.toLowerCase().includes(word)) score++;
        if (page.title.toLowerCase().includes(word)) score++;
        if (page.description.toLowerCase().includes(word)) score++;
      });
  
      return { ...page, score }; // Add score to the page object
    });
  
    // Sort results by score (higher score means better match)
    results.sort((a, b) => b.score - a.score);
  
    return results.filter(result => result.score > 0); // Filter out results with score 0
  }
  
  // Function to display the search results
  function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear any previous results
  
    if (results.length === 0) {
      resultsContainer.innerHTML = 'No results found';
    } else {
      results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.innerHTML = `
          <h3>${result.title}</h3>
          <p>${result.description}</p>
          <p style="visibility:unset"><strong>Matches: </strong>${result.score}</p>
          <p><a href="${result.url}">Go to page</a></p> <!-- Link to the actual page -->
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
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = "Results here"
   // If no query in the URL, show the search box
   searchBoxContainer.innerHTML = `
   <input type="text" id="search-box" placeholder="Search..." />
   <button id="search-button">Search</button>
 `;
 
 // Attach event listener for the search button
 document.getElementById('search-button').addEventListener('click', function() {
   const searchQuery = document.getElementById('search-box').value.trim();
   if (searchQuery) {
     window.location.search = `?q=${encodeURIComponent(searchQuery)}`;
   }
 });
 document.getElementById('search-box').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const searchQuery = document.getElementById('search-box').value.trim();
      if (searchQuery) {
        window.location.search = `?q=${encodeURIComponent(searchQuery)}`;
      }
    }
  });
  
    if (query) {
      // If a query is present in the URL, perform the search and display results
      const results = search(query, index);
      displayResults(results);
    } 
    document.getElementById('search-box').focus();
  }
  
  // Wait until the page is loaded to initialize the search
  document.addEventListener('DOMContentLoaded', async function() {
    const index = await loadIndex();  // Load the JSON index
    handleSearch(index);  // Handle the search logic (based on URL or search box)
  });
  