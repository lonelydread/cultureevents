// Favorites functionality
class FavoritesManager {
    constructor() {
        this.favorites = [];
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
        this.renderFavorites();
        this.toggleEmptyState();
    }

    renderFavorites() {
        const grid = document.getElementById('favoritesGrid');
        if (!grid) return;

        const favoritesData = this.getFavoritesData();
        
        grid.innerHTML = favoritesData.map(place => `
            <div class="favorite-card" data-id="${place.id}">
                <div class="favorite-header">
                    <div class="place-badge">
                        <span class="badge-icon">${this.getTypeIcon(place.type)}</span>
                        <span class="badge-text">${this.getTypeText(place.type)}</span>
                    </div>
                    <button class="favorite-remove-btn" onclick="favoritesManager.removeFavorite(${place.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="favorite-content">
                    <h3>${place.name}</h3>
                    <p class="place-description">${place.description}</p>
                    <div class="place-meta">
                        <div class="meta-item">
                            <i class="fas fa-walking"></i>
                            <span>${place.distance} км</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${place.rating}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${place.hours}</span>
                        </div>
                    </div>
                    <div class="place-tags">
                        ${place.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="favorite-actions">
                    <button class="btn-small primary" onclick="favoritesManager.showRoute(${place.id})">
                        <i class="fas fa-route"></i>
                        Маршрут
                    </button>
                    <button class="btn-small outline" onclick="favoritesManager.scheduleVisit(${place.id})">
                        <i class="fas fa-calendar"></i>
                        Запланировать
                    </button>
                </div>
            </div>
        `).join('');
    }

    async getFavoritesData() {
    try {
        if (this.favorites.length === 0) {
            return [];
        }

        // Отправляем один запрос со списком ID
        const response = await fetch('http://localhost:8080/api/places/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                placeIds: this.favorites
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const placesData = await response.json();
        
        // Преобразуем все данные разом
        return placesData.map(place => this.transformPlaceData(place));
        
    } catch (error) {
        console.error('Error loading favorites from API:', error);
        this.showFeedback('Ошибка загрузки избранного', 'error');
        return this.getFallbackData(); // Fallback на демо-данные
    }
}

    getTypeIcon(type) {
        const icons = {
            cafe: '☕',
            art: '🎨',
            park: '🌳',
            library: '📚',
            sports: '⚽',
            shopping: '🛍️',
            entertainment: '🎬'
        };
        return icons[type] || '📍';
    }

    getTypeText(type) {
        const types = {
            cafe: 'Кафе',
            art: 'Искусство',
            park: 'Парк',
            library: 'Библиотека',
            sports: 'Спорт',
            shopping: 'Шоппинг',
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
        
        this.renderFavorites();
        this.updateStats();
        this.toggleEmptyState();
        
        this.showFeedback('Убрано из избранного', 'info');
    }

    updateStats() {
        const favoritesData = this.getFavoritesData();
        const totalFavorites = document.getElementById('totalFavorites');
        
        if (totalFavorites) {
            totalFavorites.textContent = favoritesData.length;
        }
        
    }

    toggleEmptyState() {
        const emptyState = document.getElementById('emptyFavorites');
        const favoritesGrid = document.getElementById('favoritesGrid');
        
        if (emptyState && favoritesGrid) {
            if (this.favorites.length === 0) {
                emptyState.classList.remove('hidden');
                favoritesGrid.classList.add('hidden');
            } else {
                emptyState.classList.add('hidden');
                favoritesGrid.classList.remove('hidden');
            }
        }
    }

    shareFavorites() {
        const favoritesData = this.getFavoritesData();
        if (favoritesData.length === 0) {
            this.showFeedback('Добавьте места в избранное, чтобы поделиться списком', 'info');
            return;
        }

        const shareText = `Мои избранные места в MaxToGo:\n\n` +
            favoritesData.map(place => `📍 ${place.name} (${place.distance} км)`).join('\n');
        
        // In a real app, this would use the Web Share API
        if (navigator.share) {
            navigator.share({
                title: 'Мои избранные места - MaxToGo',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
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
        
        feedback.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
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