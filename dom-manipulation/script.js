// Initial Quotes Array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// Function: Show Random Quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${quotes[randomIndex].text}"</p>
    <small>Category: ${quotes[randomIndex].category}</small>
  `;
}

// Function: Add Quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value;
  const newCategory = document.getElementById("newQuoteCategory").value;

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    alert("Quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and category.");
  }
}

// Event Listener
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
