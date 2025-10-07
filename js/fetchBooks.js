const OPEN_LIBRARY_API = 'https://openlibrary.org';

export async function searchBooks(query, limit = 20) {
    try {
        const response = await fetch(
            `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.docs || [];
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

export async function getBooksBySubject(subject, limit = 20) {
    try {
        const response = await fetch(
            `${OPEN_LIBRARY_API}/search.json?subject=${encodeURIComponent(subject)}&limit=${limit}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.docs || [];
    } catch (error) {
        console.error('Error fetching books by subject:', error);
        return searchBooks(subject, limit);
    }
}

export function getBookCoverUrl(coverId, size = 'M') {
    if (!coverId) return '../images/placeholder-book.jpg';
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getBookReadUrl(bookKey) {
    if (!bookKey) return 'https://openlibrary.org';
    const key = bookKey.startsWith('/works/') ? bookKey : `/works/${bookKey}`;
    return `https://openlibrary.org${key}`;
}

export function formatBookData(bookData) {
    const title = bookData.title || 'Unknown Title';
    
    let author = 'Unknown Author';
    if (bookData.author_name && bookData.author_name.length > 0) {
        author = bookData.author_name[0];
    }
    
    // Better description logic
    let description = 'Discover this fascinating book and explore its contents.';
    if (bookData.first_sentence && bookData.first_sentence.length > 0) {
        description = Array.isArray(bookData.first_sentence) 
            ? bookData.first_sentence[0] 
            : bookData.first_sentence;
    } else if (title && author) {
        description = `A captivating book by ${author}. Explore this work to discover its story and themes.`;
    }
    
    const id = bookData.key ? bookData.key.replace('/works/', '') : 
               `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const category = getCategoryFromData(bookData);
    const coverId = bookData.cover_i;
    const bookKey = bookData.key;

    return {
        id,
        title,
        author,
        description: description.length > 120 ? description.substring(0, 120) + '...' : description,
        image: getBookCoverUrl(coverId),
        readUrl: getBookReadUrl(bookKey),
        category,
        published: bookData.first_publish_year,
        subjects: bookData.subject || []
    };
}

// IMPROVED category detection - returns null for "general" categories
function getCategoryFromData(bookData) {
    const categories = {
        'science': ['science', 'physics', 'chemistry', 'biology', 'mathematics', 'scientific', 'technology', 'engineering'],
        'history': ['history', 'historical', 'war', 'ancient', 'medieval', 'biography', 'world war'],
        'fantasy': ['fantasy', 'magic', 'dragon', 'wizard', 'mythical', 'epic fantasy'],
        'mystery': ['mystery', 'crime', 'detective', 'thriller', 'suspense', 'murder'],
        'fiction': ['fiction', 'novel', 'literature', 'romance', 'drama']
    };
    
    if (bookData.subject) {
        const subjects = Array.isArray(bookData.subject) ? bookData.subject : [bookData.subject];
        
        // Check each subject against all categories
        for (let subject of subjects.slice(0, 10)) {
            const subjectLower = subject.toLowerCase();
            
            for (const [category, keywords] of Object.entries(categories)) {
                if (keywords.some(keyword => subjectLower.includes(keyword))) {
                    return category;
                }
            }
        }
    }
    
    // Return null for general/unclassified books - no category will be shown
    return null;
}  