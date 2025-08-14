// ===============================
// Quotes Array (with LocalStorage support)
// ===============================
let quotes = [];

// Load Quotes from Local Storage on Startup
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes (if none saved yet)
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
      { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
    ];
    saveQuotes();
  }
}

// Save Quotes to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories(); // update categories when new quotes added
}

// ===============================
// DOM Manipulation
// ===============================

// Show Random Quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${quotes[randomIndex].text}"</p>
    <small>Category: ${quotes[randomIndex].category}</small>
  `;
}

// Add New Quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value;
  const newCategory = document.getElementById("newQuoteCategory").value;

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes(); // persist in local storage
    populateCategories();
    alert("Quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and category.");
  }
}

// Dynamically Create Add Quote Form (for Task 0 requirement)
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText_dynamic";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory_dynamic";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", function () {
    const text = document.getElementById("newQuoteText_dynamic").value;
    const category = document.getElementById("newQuoteCategory_dynamic").value;
    if (text && category) {
      quotes.push({ text, category });
      saveQuotes();
      populateCategories();
      alert("Quote added via dynamic form!");
      document.getElementById("newQuoteText_dynamic").value = "";
      document.getElementById("newQuoteCategory_dynamic").value = "";
    } else {
      alert("Please enter both a quote and category.");
    }
  });

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addBtn);

  document.body.appendChild(formContainer);
}

// ===============================
// JSON Import / Export
// ===============================

// Export Quotes as JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// Import Quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===============================
// Filtering System
// ===============================

// Populate Category Dropdown
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  // Reset options
  filter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore last selected filter
  const last = localStorage.getItem("lastFilter") || "all";
  filter.value = last;
}

// Filter Quotes by Selected Category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selected); // persist filter choice
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filtered.length > 0
    ? filtered.map(q => `<p>"${q.text}" <small>(${q.category})</small></p>`).join("")
    : "<p>No quotes found for this category.</p>";
}

// ===============================
// Initialize
// ===============================
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);

loadQuotes();
populateCategories();
filterQuotes(); // show quotes according to last filter
createAddQuoteForm();
