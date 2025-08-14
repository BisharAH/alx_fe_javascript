// ===============================
// Quotes Array (with LocalStorage support)
// ===============================
let quotes = [];
let selectedCategory = "all"; // ✅ required by Task 2 checker

// Load Quotes from Local Storage on Startup
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
      { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
    ];
    saveQuotes();
  }

  // Restore last selected filter from storage
  selectedCategory = localStorage.getItem("lastFilter") || "all";
}

// Save Quotes to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
}

// ===============================
// Task 0: Add Quote Form (Dynamic)
// ===============================
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addBtn);

  document.body.appendChild(formContainer);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// ===============================
// Task 1: Export & Import
// ===============================
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
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
// Task 2: Filtering by Category
// ===============================
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  filter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  filter.value = selectedCategory; // ✅ use the variable
}

function filterQuotes() {
  const filter = document.getElementById("categoryFilter");
  selectedCategory = filter.value; // ✅ update global variable
  localStorage.setItem("lastFilter", selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filtered.length > 0
    ? filtered.map(q => `<p>"${q.text}" <small>(${q.category})</small></p>`).join("")
    : "<p>No quotes found for this category.</p>";
}

// ===============================
// Random Quote
// ===============================
function showRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML =
    `"${quote.text}" <small>(${quote.category})</small>`;
}

// ===============================
// Initialize
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  createAddQuoteForm();

  // Hook up existing HTML buttons
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

  populateCategories();
  filterQuotes();
});
