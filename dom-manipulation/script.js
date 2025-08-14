// Load quotes from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Do or do not. There is no try.", cat// Simulated server data
let serverQuotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Do or do not. There is no try.", category: "Motivation" },
  { text: "Stay hungry, stay foolish.", category: "Life" }
];

// Local quotes (loaded from localStorage)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [...serverQuotes];

// Save quotes locally
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Remove old options (except 'All Categories')
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore saved category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Display a random quote
function displayRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    alert("No quotes available for this category.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }
  const textNode = document.createTextNode(`"${quote.text}" — ${quote.category}`);
  quoteDisplay.appendChild(textNode);
}

// Simulate server sync
function syncWithServer(newQuote, callback) {
  setTimeout(() => {
    // Check for conflict
    const existsOnServer = serverQuotes.some(
      q => q.text.toLowerCase() === newQuote.text.toLowerCase()
    );

    if (existsOnServer) {
      callback("Conflict: This quote already exists on the server.");
    } else {
      serverQuotes.push(newQuote);
      callback(null); // No error
    }
  }, 1000); // Simulate 1s delay
}

// Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };

  // Simulate sending to server
  syncWithServer(newQuote, (error) => {
    if (error) {
      alert(error); // Conflict detected
    } else {
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();

      const quoteDisplay = document.getElementById("quoteDisplay");
      while (quoteDisplay.firstChild) {
        quoteDisplay.removeChild(quoteDisplay.firstChild);
      }
      const textNode = document.createTextNode(`"${newText}" — ${newCategory}`);
      quoteDisplay.appendChild(textNode);

      textInput.value = "";
      categoryInput.value = "";
    }
  });
}

// Filter quotes when category changes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Initial load
window.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  displayRandomQuote();
});egory: "Motivation" },
  { text: "Stay hungry, stay foolish.", category: "Life" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Remove old options (except 'All Categories')
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category if saved
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Display a random quote
function displayRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    alert("No quotes available for this category.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }
  const textNode = document.createTextNode(`"${quote.text}" — ${quote.category}`);
  quoteDisplay.appendChild(textNode);
}

// Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories();

    // Show the newly added quote
    const quoteDisplay = document.getElementById("quoteDisplay");
    while (quoteDisplay.firstChild) {
      quoteDisplay.removeChild(quoteDisplay.firstChild);
    }
    const textNode = document.createTextNode(`"${newText}" — ${newCategory}`);
    quoteDisplay.appendChild(textNode);

    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Filter quotes when category changes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Initial load
window.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  displayRandomQuote();
});
