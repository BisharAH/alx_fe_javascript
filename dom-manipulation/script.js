let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Do or do not. There is no try.", category: "Motivation" },
  { text: "Stay hungry, stay foolish.", category: "Life" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${quotes[randomIndex].text}" — ${quotes[randomIndex].category}`;
}

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
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
