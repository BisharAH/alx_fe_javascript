// Task 0: Dynamic Quote Generator

// Quotes array with text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Do or do not. There is no try.", category: "Motivation" },
  { text: "Stay hungry, stay foolish.", category: "Life" }
];

// Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear old content
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }

  // Append new quote
  const textNode = document.createTextNode(`"${quote.text}" — ${quote.category}`);
  quoteDisplay.appendChild(textNode);
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });

    // Immediately show the new quote
    const quoteDisplay = document.getElementById("quoteDisplay");
    while (quoteDisplay.firstChild) {
      quoteDisplay.removeChild(quoteDisplay.firstChild);
    }
    const textNode = document.createTextNode(`"${newText}" — ${newCategory}`);
    quoteDisplay.appendChild(textNode);

    // Clear input fields
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listener for Show New Quote button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
