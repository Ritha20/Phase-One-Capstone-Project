## Phase-One-Capstone-Project
#Phase one capstone project in she can code 
# Book Explorer 

A responsive web application for discovering and exploring books from the Open Library API.

## Project Structure

```
book-explorer/
│
├── index.html          # Homepage with book search & categories
├── about.html          # About page with app information
├── favorites.html      # Favorites page with saved books
│
├── js/
│   ├── main.js         # Main application logic & mobile menu
│   ├── fetchBooks.js   # API functions for Open Library
│   └── favorites.js    # Favorites management
│
└── images/
    └── placeholder-book.jpg  # Default book cover image
```

## File Dependencies

### HTML Files → JavaScript
- **index.html** → `main.js` + `fetchBooks.js`
- **favorites.html** → `favorites.js` 
- **about.html** → No JavaScript needed

### JavaScript Dependencies
- **main.js** → imports from `fetchBooks.js`
- **favorites.js** → standalone (uses localStorage)
- **fetchBooks.js** → standalone API functions

## Features
-  Search thousands of books
- Fully responsive design
-  Save favorite books
-  Filter by categories
- Direct links to read books

## Technology Stack
- HTML5, Tailwind CSS, Vanilla JavaScript
- Open Library API
- LocalStorage for favorites

## Setup
1. Open `index.html` in a web browser
2. Start searching for books!
3. No build process required

This the final Readme File of Phase one Capstone.
