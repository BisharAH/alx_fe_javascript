// Initial quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Do or do not. There is no try.", category: "Motivation" },
  { text: "Stay hungry, stay foolish.", category: "Life" }
];

// Display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear old content
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }

  // Create a text node for the quote
  const textNode = document.createTextNode(`"${quote.text}" — ${quote.category}`);
  quoteDisplay.appendChild(textNode);
}

// Add new quote from inputs
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
