// Hardcoded book data (same as in favorites.js)
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

function toggleFavorite(bookId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(bookId);
    
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
    } else {
        // Add to favorites
        favorites.push(bookId);
    }
    
    saveFavorites(favorites);
    updateFavoriteButtons();
    return !(index > -1); // Return true if added, false if removed
}

function updateFavoriteButtons() {
    const favorites = getFavorites();
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    
    favoriteBtns.forEach(btn => {
        const bookId = btn.getAttribute('data-id');
        const heartIcon = btn.querySelector('i');
        
        if (favorites.includes(bookId)) {
            heartIcon.className = 'fas fa-heart text-red-500';
            btn.classList.add('bg-red-100');
            btn.classList.remove('bg-gray-100');
        } else {
            heartIcon.className = 'far fa-heart';
            btn.classList.remove('bg-red-100');
            btn.classList.add('bg-gray-100');
        }
    });
}

// Initialize favorite buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to existing favorite buttons
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = this.getAttribute('data-id');
            toggleFavorite(bookId);
        });
    });
    
    // Update initial state of buttons
    updateFavoriteButtons();
});