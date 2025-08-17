// ===============================
// Quotes Array (with LocalStorage support)
// ===============================
let quotes = [];
let selectedCategory = "all"; // ✅ required by Task 2
let searchQuery = ""; // ✅ required by Task 3

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
  searchQuery = localStorage.getItem("lastSearch") || "";
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
    filterQuotes(); // refresh view
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
        filterQuotes(); // refresh view
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

  filter.value = selectedCategory; // ✅ use variable
}

function filterQuotes() {
  const filter = document.getElementById("categoryFilter");
  if (filter) {
    selectedCategory = filter.value; // ✅ update global variable
    localStorage.setItem("lastFilter", selectedCategory);
  }

  // Apply category + search together
  let filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (searchQuery) {
    filtered = filtered.filter(q => q.text.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filtered.length > 0
    ? filtered.map(q => `<p>"${q.text}" <small>(${q.category})</small></p>`).join("")
    : "<p>No quotes found.</p>";
}

// ===============================
// Task 3: Search Functionality
// ===============================
function searchQuotes(event) {
  searchQuery = event.target.value.trim();
  localStorage.setItem("lastSearch", searchQuery);
  filterQuotes();
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

  // Hook up buttons & inputs
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("searchInput").addEventListener("input", searchQuotes);

  populateCategories();
  document.getElementById("searchInput").value = searchQuery; // restore last search
  filterQuotes();
});












// ===============================
// Quotes Array (with LocalStorage + Server Sync)
// ===============================
let quotes = [];
let selectedCategory = "all";
let searchQuery = "";

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; 

// ===============================
// Utilities
// ===============================
function uid() {
  return "q-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function showNotification(message) {
  const note = document.getElementById("notification");
  note.textContent = message;
  note.style.display = "block";
  setTimeout(() => (note.style.display = "none"), 4000);
}

// ===============================
// Load / Save
// ===============================
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { id: uid(), text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { id: uid(), text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
      { id: uid(), text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
    ];
    saveQuotes();
  }

  selectedCategory = localStorage.getItem("lastFilter") || "all";
  searchQuery = localStorage.getItem("lastSearch") || "";
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
}

// ===============================
// Add Quote
// ===============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { id: uid(), text, category };
    quotes.push(newQuote);
    saveQuotes();
    syncWithServer(newQuote); // push new quote
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
    filterQuotes();
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// ===============================
// Export & Import
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
        quotes.push(...importedQuotes.map(q => ({ ...q, id: uid() })));
        saveQuotes();
        alert("Quotes imported successfully!");
        filterQuotes();
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
// Filtering & Search
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

  filter.value = selectedCategory;
}

function filterQuotes() {
  const filter = document.getElementById("categoryFilter");
  if (filter) {
    selectedCategory = filter.value;
    localStorage.setItem("lastFilter", selectedCategory);
  }

  let filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (searchQuery) {
    filtered = filtered.filter(q => q.text.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filtered.length > 0
    ? filtered.map(q => `<p>"${q.text}" <small>(${q.category})</small></p>`).join("")
    : "<p>No quotes found.</p>";
}

function searchQuotes(event) {
  searchQuery = event.target.value.trim();
  localStorage.setItem("lastSearch", searchQuery);
  filterQuotes();
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
// Server Sync
// ===============================
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  let serverQuotes = await response.json();

  // simulate converting server data to our format
  return serverQuotes.slice(0, 5).map(p => ({
    id: "srv-" + p.id,
    text: p.title,
    category: "Server"
  }));
}

async function syncWithServer(newQuote = null) {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Merge local + server
    const localMap = new Map(quotes.map(q => [q.id, q]));
    const serverMap = new Map(serverQuotes.map(q => [q.id, q]));

    // Conflict resolution: server wins
    serverMap.forEach((srvQuote, id) => {
      if (!localMap.has(id)) {
        quotes.push(srvQuote);
      } else {
        localMap.set(id, srvQuote);
      }
    });

    saveQuotes();
    filterQuotes();
    showNotification("Quotes synced with server (server wins).");

    // Push new quote (simulation)
    if (newQuote) {
      await fetch(SERVER_URL, {
        method: "POST",
        body: JSON.stringify(newQuote),
        headers: { "Content-Type": "application/json" }
      });
      showNotification("New quote synced to server.");
    }
  } catch (err) {
    console.error("Sync error:", err);
    showNotification("⚠️ Failed to sync with server.");
  }
}

// ===============================
// Initialize
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("searchInput").addEventListener("input", searchQuotes);

  populateCategories();
  document.getElementById("searchInput").value = searchQuery;
  filterQuotes();

  // Periodic sync
  setInterval(syncWithServer, 15000);
});
