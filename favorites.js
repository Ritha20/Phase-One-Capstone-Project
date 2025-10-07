// Hardcoded book data matching your index.html
const bookData = {
    'book1': {
        id: 'book1',
        title: 'This Could be Us',
        author: 'Emily Henry',
        description: 'A Romance story that will keep you guessing until the very last page.',
        image: './images/image 1.avif',
        category: 'fiction'
    },
    'book2': {
        id: 'book2',
        title: 'The Year of Watching',
        author: 'Alexis Handerson',
        description: 'An epic adventure across uncharted lands and mysterious realms.',
        image: './images/image 2.jpeg',
        category: 'fantasy'
    },
    'book3': {
        id: 'book3',
        title: 'Whispering Key',
        author: 'A.J Hawthorne',
        description: 'A mystery novel where they are looking an answer using the key',
        image: './images/image 3.webp',
        category: 'mystery'
    },
    'book4': {
        id: 'book4',
        title: 'The Vines',
        author: 'Shelley Nolden',
        description: 'A dystopian novel about survival in a post-apocalyptic world.',
        image: './images/image 4..webp',
        category: 'fiction'
    },
    'book5': {
        id: 'book5',
        title: 'The Great of Science',
        author: 'AlbertEeinsten',
        description: 'A story of science and practising the usage of chemicals.',
        image: './images/image 5.jpeg',
        category: 'science'
    },
    'book6': {
        id: 'book6',
        title: 'LegendBorn',
        author: 'Tracy Deon',
        description: 'A love story of girl who lost in the bush and found by a Prince.',
        image: './images/image 6.jpeg',
        category: 'fantasy'
    },
    'book7': {
        id: 'book7',
        title: 'Amari and The Night Brothers',
        author: 'B.B. Aliston',
        description: 'A captivating tale of a girl loved by Brothers.',
        image: './images/image7.jpg',
        category: 'fantasy'
    },
    'book8': {
        id: 'book8',
        title: 'Study Drowning',
        author: 'AVA Reid',
        description: 'A romantic story of love and resilience in a mountain town.',
        image: './images/image 8.jpg',
        category: 'fiction'
    }
};

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

// DOM functions
function displayFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyState');
    const favorites = getFavorites();

    // Clear the grid
    favoritesGrid.innerHTML = '';

    if (favorites.length === 0) {
        emptyState.classList.remove('hidden');
        favoritesGrid.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    favoritesGrid.classList.remove('hidden');

    favorites.forEach(bookId => {
        const book = bookData[bookId];
        if (book) {
            const bookCard = createFavoriteBookCard(book);
            favoritesGrid.appendChild(bookCard);
        }
    });
}

function createFavoriteBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
    card.innerHTML = `
        <div class="book-image-placeholder h-48">
            <img src="${book.image}" alt="${book.title} book cover" class="w-full h-full object-cover">
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1 line-clamp-1">${book.title}</h3>
            <p class="text-gray-600 text-sm mb-2">${book.author}</p>
            <p class="text-gray-700 text-sm mb-4 line-clamp-2">${book.description}</p>
            <div class="flex gap-2">
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium">
                    Start Reading
                </button>
                <button class="remove-favorite-btn bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-md transition" data-id="${book.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    // Add event listener to remove button
    const removeBtn = card.querySelector('.remove-favorite-btn');
    removeBtn.addEventListener('click', () => {
        removeFromFavorites(book.id);
        displayFavorites(); // Refresh the display
    });

    return card;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayFavorites();
});