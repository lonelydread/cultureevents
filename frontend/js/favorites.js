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

    getFavoritesData() {
        // Mock data - in real app this would come from an API based on favorite IDs
        const allPlaces = {
            1: {
                id: 1,
                name: 'Кофейня "Уютный уголок"',
                type: 'cafe',
                description: 'Атмосферное место с авторским кофе и домашней выпечкой. Бесплатный Wi-Fi и розетки.',
                distance: 0.5,
                rating: 4.9,
                hours: '7:00-23:00',
                tags: ['Wi-Fi', 'Веганское меню', 'Рабочее место']
            },
            2: {
                id: 2,
                name: 'Галерея современного искусства',
                type: 'art',
                description: 'Современные выставки, инсталляции и мастер-классы. Вдохновляющая атмосфера для творческих натур.',
                distance: 0.8,
                rating: 4.6,
                hours: '11:00-20:00',
                tags: ['Выставки', 'Мастер-классы', 'Интерактивно']
            },
            3: {
                id: 3,
                name: 'Центральный парк культуры',
                type: 'park',
                description: 'Просторный парк с озерами, велодорожками и зонами для пикника. Идеально для активного отдыха.',
                distance: 1.2,
                rating: 4.8,
                hours: '6:00-23:00',
                tags: ['Велодорожки', 'Озеро', 'Пикник']
            },
            4: {
                id: 4,
                name: 'Библиотека им. Горького',
                type: 'library',
                description: 'Просторные читальные залы, современный интерьер и богатая коллекция литературы.',
                distance: 1.5,
                rating: 4.7,
                hours: '9:00-21:00',
                tags: ['Тишина', 'Wi-Fi', 'Исследования']
            },
            5: {
                id: 5,
                name: 'Спортивный комплекс "Энергия"',
                type: 'sports',
                description: 'Современный фитнес-центр с бассейном, тренажерным залом и групповыми занятиями.',
                distance: 2.1,
                rating: 4.7,
                hours: '6:00-24:00',
                tags: ['Бассейн', 'Тренажеры', 'Групповые занятия']
            }
        };

        return this.favorites.map(id => allPlaces[id]).filter(Boolean);
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
        const nearbyFavorites = document.getElementById('nearbyFavorites');
        
        if (totalFavorites) {
            totalFavorites.textContent = favoritesData.length;
        }
        
        if (nearbyFavorites) {
            const nearbyCount = favoritesData.filter(place => place.distance <= 2).length;
            nearbyFavorites.textContent = nearbyCount;
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

    showRoute(placeId) {
        const place = this.getFavoritesData().find(p => p.id === placeId);
        if (place) {
            this.showFeedback(`Построение маршрута до "${place.name}"`, 'info');
        }
    }

    scheduleVisit(placeId) {
        const place = this.getFavoritesData().find(p => p.id === placeId);
        if (place) {
            // In a real app, this would open a calendar/scheduling interface
            this.showFeedback(`Запланировано посещение "${place.name}"`, 'success');
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