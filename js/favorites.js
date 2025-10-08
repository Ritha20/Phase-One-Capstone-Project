// favorites.js - FIXED with reliable favorite management

// Local Storage functions
function getFavorites() {
    const favorites = localStorage.getItem('bookFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
}

function removeFromFavorites(bookId) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(id => id !== bookId);
    saveFavorites(updatedFavorites);
    return updatedFavorites;
}

function getStoredBookData(bookId) {
    const allBooksData = JSON.parse(localStorage.getItem('allBooksData') || '{}');
    return allBooksData[bookId];
}

// DOM functions
function displayFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyState');
    const favorites = getFavorites();

    favoritesGrid.innerHTML = '';

    if (favorites.length === 0) {
        emptyState.classList.remove('hidden');
        favoritesGrid.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    favoritesGrid.classList.remove('hidden');

    let hasValidBooks = false;

    favorites.forEach(bookId => {
        const bookData = getStoredBookData(bookId);
        if (bookData && bookData.title && bookData.title !== 'Unknown Title') {
            const bookCard = createFavoriteBookCard(bookData);
            favoritesGrid.appendChild(bookCard);
            hasValidBooks = true;
        }
    });

    // If no valid books found, show empty state
    if (!hasValidBooks) {
        emptyState.classList.remove('hidden');
        favoritesGrid.classList.add('hidden');
        
        // Clear invalid favorites
        saveFavorites([]);
    }
}

function createFavoriteBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card bg-purple-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
    
    const imageUrl = book.image || '../images/placeholder-book.jpg';
    const readUrl = book.readUrl || 'https://openlibrary.org';
    
    card.innerHTML = `
        <div class="book-image-placeholder h-48 bg-purple-100">
            <img src="${imageUrl}" alt="${book.title} book cover" 
                 class="w-full h-full object-cover"
                 onerror="this.src='../images/placeholder-book.jpg'">
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1 line-clamp-1">${book.title}</h3>
            <p class="text-gray-600 text-sm mb-2">${book.author}</p>
            <p class="text-gray-700 text-sm mb-4 line-clamp-2">${book.description}</p>
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                ${book.category ? `<span class="category-tag bg-purple-100 text-purple-800 px-2 py-1 rounded capitalize">${book.category}</span>` : '<span></span>'}
                <span></span>
            </div>
            <div class="flex gap-2">
                <a href="${readUrl}" target="_blank" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-medium transition-colors text-center">
                    Start Reading
                </a>
                <button class="remove-favorite-btn bg-purple-100 hover:bg-purple-200 text-purple-600 p-2 rounded-md transition border border-purple-300" data-id="${book.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    const removeBtn = card.querySelector('.remove-favorite-btn');
    removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeFromFavorites(book.id);
        // Add removal animation
        card.style.opacity = '0.5';
        setTimeout(() => {
            displayFavorites(); // Refresh the display
        }, 300);
    });

    return card;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayFavorites();
});