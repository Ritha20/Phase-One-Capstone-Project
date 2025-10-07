// main.js - COMPLETELY FIXED favorites and event handling
import { searchBooks, getBooksBySubject, formatBookData } from './fetchBooks.js';

// Global variables
let currentBooks = [];
let currentCategory = '';
let currentSearchQuery = '';

// DOM elements
const booksGrid = document.getElementById('booksGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const selectedCategory = document.getElementById('selectedCategory');
const categoryItems = document.querySelectorAll('.category-item');

// Local Storage functions
function getFavorites() {
    const favorites = localStorage.getItem('bookFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
}

function toggleFavorite(bookId) {
    const favorites = getFavorites();
    const isCurrentlyFavorite = favorites.includes(bookId);
    
    if (isCurrentlyFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(id => id !== bookId);
        saveFavorites(updatedFavorites);
    } else {
        // Add to favorites
        favorites.push(bookId);
        saveFavorites(favorites);
    }
    
    updateFavoriteButtons();
    return !isCurrentlyFavorite;
}

function updateFavoriteButtons() {
    const favorites = getFavorites();
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    
    favoriteBtns.forEach(btn => {
        const bookId = btn.getAttribute('data-id');
        const heartIcon = btn.querySelector('i');
        
        if (favorites.includes(bookId)) {
            heartIcon.className = 'fas fa-heart text-red-500';
            btn.classList.add('bg-red-100', 'border', 'border-red-300');
            btn.classList.remove('bg-gray-100');
        } else {
            heartIcon.className = 'far fa-heart';
            btn.classList.remove('bg-red-100', 'border', 'border-red-300');
            btn.classList.add('bg-gray-100');
        }
    });
}

// Store book data when favoriting
function storeBookData(book) {
    const bookData = {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        image: book.image,
        readUrl: book.readUrl,
        category: book.category
    };
    
    const allBooksData = JSON.parse(localStorage.getItem('allBooksData') || '{}');
    allBooksData[book.id] = bookData;
    localStorage.setItem('allBooksData', JSON.stringify(allBooksData));
}

// API Functions
async function loadInitialBooks() {
    showLoading();
    try {
        // Load diverse books by default
        const books = await searchBooks('popular books', 16);
        if (books && books.length > 0) {
            currentBooks = books.map(book => formatBookData(book));
            displayBooks(currentBooks);
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Error loading books:', error);
        showError('Failed to load books. Please check your internet connection and try again.');
    } finally {
        hideLoading();
    }
}

async function searchBooksByQuery(query) {
    if (!query.trim()) {
        await loadInitialBooks();
        return;
    }

    showLoading();
    try {
        const books = await searchBooks(query, 16);
        currentBooks = books.map(book => formatBookData(book));
        currentSearchQuery = query;
        displayBooks(currentBooks);
        
        if (books.length === 0) {
            showNoResults();
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('Search failed. Please check your connection and try again.');
    } finally {
        hideLoading();
    }
}

async function filterBooksByCategory(category) {
    if (category === currentCategory && category !== '') return;

    showLoading();
    try {
        let books;
        if (category) {
            books = await getBooksBySubject(category, 20);
        } else {
            books = await searchBooks('popular books', 16);
        }
        
        if (books && books.length > 0) {
            currentBooks = books.map(book => formatBookData(book));
            currentCategory = category;
            displayBooks(currentBooks);
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Filter error:', error);
        showError('Failed to load books for this category. Please try another category.');
    } finally {
        hideLoading();
    }
}

// Display Functions
function displayBooks(books) {
    booksGrid.innerHTML = '';
    noResults.classList.add('hidden');
    
    if (!books || books.length === 0) {
        showNoResults();
        return;
    }

    const validBooks = books.filter(book => 
        book && book.title && book.title !== 'Unknown Title'
    );

    if (validBooks.length === 0) {
        showNoResults();
        return;
    }

    validBooks.forEach(book => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
    });
    
    // Update favorite buttons after creating all cards
    updateFavoriteButtons();
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
    
    const imageUrl = book.image || '../images/placeholder-book.jpg';
    
    card.innerHTML = `
        <div class="book-image-placeholder h-48 bg-gray-200">
            <img src="${imageUrl}" alt="${book.title} book cover" 
                 class="w-full h-full object-cover" 
                 onerror="this.src='../images/placeholder-book.jpg'">
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1 line-clamp-1">${book.title}</h3>
            <p class="text-gray-600 text-sm mb-2">${book.author}</p>
            <p class="text-gray-700 text-sm mb-4 line-clamp-2">${book.description}</p>
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                ${book.category ? `<span class="category-tag bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">${book.category}</span>` : '<span></span>'}
                ${book.published ? `<span>${book.published}</span>` : '<span></span>'}
            </div>
            <div class="flex gap-2">
                <a href="${book.readUrl}" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors text-center">
                    Start Reading
                </a>
                <button class="favorite-btn bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-md transition" data-id="${book.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    // Add event listener to favorite button
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const wasAdded = toggleFavorite(book.id);
        if (wasAdded) {
            storeBookData(book);
            // Show visual feedback
            this.classList.add('scale-110');
            setTimeout(() => this.classList.remove('scale-110'), 300);
        }
    });

    return card;
}
// UI State Functions
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    booksGrid.classList.add('hidden');
    noResults.classList.add('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
    booksGrid.classList.remove('hidden');
}

function showNoResults() {
    booksGrid.innerHTML = '';
    noResults.classList.remove('hidden');
}

function showError(message) {
    booksGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
            <div class="text-red-500 text-lg mb-2">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <p class="text-gray-600">${message}</p>
            <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Reload Page
            </button>
        </div>
    `;
}

// Event Listeners
function initializeEventListeners() {
    // Search button click
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        searchBooksByQuery(query);
    });

    // Enter key in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            searchBooksByQuery(query);
        }
    });

    // Category filter
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            
            // Update active state
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update selected category text
            selectedCategory.textContent = item.textContent.trim();
            
            // Filter books
            filterBooksByCategory(category);
        });
    });
}

// Global function for retry button
window.retryLoading = function() {
    loadInitialBooks();
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadInitialBooks();
});