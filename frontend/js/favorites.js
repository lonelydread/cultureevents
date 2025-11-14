// Favorites functionality
class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.favoritesData = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadFavorites();
        this.bindEvents();
        this.updateStats();
    }

    loadUserData() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const data = JSON.parse(userData);
            this.updateUserInfo(data);
        }
    }

    updateUserInfo(userData) {
        const displayName = document.getElementById('displayName');
        if (displayName && userData.name) {
            displayName.textContent = userData.name;
        }

        const userMood = document.getElementById('userMood');
        if (userMood && userData.mood) {
            const moodText = this.getMoodText(userData.mood);
            userMood.textContent = moodText;
        }
    }

    getMoodText(mood) {
        const moods = {
            active: '💪 Энергичный',
            relaxed: '😌 Расслабленный',
            social: '👥 Общительный',
            creative: '🎨 Творческий'
        };
        return moods[mood] || '😊 Хорошее настроение';
    }

    loadFavorites() {
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.loadFavoritesData().then(() => {
            this.renderFavorites();
            this.toggleEmptyState();
        });
    }

    async loadFavoritesData() {
        try {
            if (this.favorites.length === 0) {
                this.favoritesData = [];
                return;
            }

            // Загружаем рекомендации из localStorage
            const recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
            
            // Фильтруем рекомендации по ID избранных
            this.favoritesData = recommendations.filter(place => 
                this.favorites.includes(place.id)
            );

            console.log('Loaded favorites data:', this.favoritesData);

        } catch (error) {
            console.error('Error loading favorites data:', error);
            this.favoritesData = [];
        }
    }

    renderFavorites() {
        const grid = document.getElementById('favoritesGrid');
        if (!grid) return;

        console.log('Rendering favorites:', this.favoritesData);

        if (this.favoritesData.length === 0) {
            grid.innerHTML = '';
            return;
        }

        grid.innerHTML = this.favoritesData.map((event, index) => `
            <div class="recommendation-card" data-id="${event.id || index}">
                <div class="card-image">
                    ${event.imageUrl ?
                    `<img src="${event.imageUrl}" alt="${event.title}" onerror="this.style.display='none'">` :
                    this.getTypeIcon(event.category)
                    }
                    <div class="place-type">${this.getTypeText(event.category)}</div>
                    <button class="favorite-btn" onclick="favoritesManager.removeFavorite(${event.id || index})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="card-content">
                    <h3>${event.title || `Событие ${index + 1}`}</h3>
                    <p>${event.description || 'Интересное событие для посещения'}</p>
                    
                    <!-- Блок даты и времени -->
                    <div class="event-time-info">
                        <div class="time-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${this.formatDate(event.date)}</span>
                        </div>
                        <div class="time-item">
                            <i class="fas fa-clock"></i>
                            <span>${this.formatTime(event.date)}</span>
                        </div>
                        ${event.location ? `
                        <div class="time-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="card-details">
                        <div class="detail-item">
                            <i class="fas fa-tag"></i>
                            <span>${this.getTypeText(event.category)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.city || 'Москва'}</span>
                        </div>
                        ${event.price ? `
                        <div class="detail-item">
                            <i class="fas fa-ruble-sign"></i>
                            <span>${this.formatPrice(event.price)}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="action-btn secondary-action" onclick="favoritesManager.showDetails(${event.id || index})">
                            <i class="fas fa-info-circle"></i>
                            Подробнее
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
            });
        } catch (e) {
            console.warn('Error formatting date:', e);
            return '-';
        }
    }

    formatTime(dateString) {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.warn('Error formatting time:', e);
            return '-';
        }
    }

    formatPrice(price) {
        if (price === 0 || price === '0') {
            return 'Бесплатно';
        }
        return `${price} ₽`;
    }

    getTypeIcon(category) {
        const icons = {
            nature: '🌳',
            art: '🎨',
            culture: '🎭',
            sports: '⚽',
            science: '🔬',
            music: '🎵',
            cafe: '☕',
            entertainment: '🎬'
        };
        return icons[category] || '📍';
    }

    getTypeText(type) {
        const types = {
            nature: 'Природа',
            art: 'Искусство',
            culture: 'Культура',
            sports: 'Спорт',
            science: 'Наука',
            music: 'Музыка',
            cafe: 'Кафе',
            entertainment: 'Развлечения'
        };
        return types[type] || 'Место';
    }

    bindEvents() {
        // Action buttons
        document.querySelector('.action-btn.primary')?.addEventListener('click', () => {
            this.shareFavorites();
        });

        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });

        // Explore favorites button
        document.getElementById('exploreFavoritesBtn')?.addEventListener('click', () => {
            window.location.href = 'recommendations.html';
        });
    }

    removeFavorite(placeId) {
        this.favorites = this.favorites.filter(id => id !== placeId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        
        // Обновляем данные и перерисовываем
        this.loadFavoritesData().then(() => {
            this.renderFavorites();
            this.updateStats();
            this.toggleEmptyState();
        });
        
        this.showFeedback('Убрано из избранного', 'info');
    }

    updateStats() {
        const totalFavorites = document.getElementById('totalFavorites');
        
        if (totalFavorites) {
            totalFavorites.textContent = this.favoritesData.length;
        }
    }

    toggleEmptyState() {
        const emptyState = document.getElementById('emptyFavorites');
        const favoritesGrid = document.getElementById('favoritesGrid');
        const stats = document.querySelector('.favorites-stats');
        const actions = document.querySelector('.favorites-actions');
        
        if (emptyState && favoritesGrid && stats && actions) {
            if (this.favoritesData.length === 0) {
                emptyState.classList.remove('hidden');
                favoritesGrid.classList.add('hidden');
                stats.classList.add('hidden');
                actions.classList.add('hidden');
            } else {
                emptyState.classList.add('hidden');
                favoritesGrid.classList.remove('hidden');
                stats.classList.remove('hidden');
                actions.classList.remove('hidden');
            }
        }
    }

    showDetails(placeId) {
        const place = this.favoritesData.find(p => p.id === placeId);
        if (place) {
            this.showFeedback(`Подробная информация о "${place.title}"`, 'info');
        }
    }

    shareFavorites() {
        if (this.favoritesData.length === 0) {
            this.showFeedback('Добавьте места в избранное, чтобы поделиться списком', 'info');
            return;
        }

        const shareText = `Мои избранные места в MaxToGo:\n\n` +
            this.favoritesData.map(place => `📍 ${place.title}`).join('\n');
        
        if (navigator.share) {
            navigator.share({
                title: 'Мои избранные места - MaxToGo',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showFeedback('Список избранного скопирован в буфер обмена', 'success');
            });
        }
    }

    showSettings() {
        this.showFeedback('Открытие настроек', 'info');
    }

    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `feedback feedback-${type}`;
        feedback.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.remove();
            }
        }, 3000);
    }
}

// Initialize favorites manager
let favoritesManager;

document.addEventListener('DOMContentLoaded', () => {
    favoritesManager = new FavoritesManager();
});