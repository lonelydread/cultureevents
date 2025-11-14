// Recommendations functionality
class RecommendationsManager {
    constructor() {
        this.recommendations = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadRecommendationsFromBackend(); // Заменяем generateRecommendations
        this.bindEvents();
    }

    async loadRecommendationsFromBackend() {
        try {
            // Пытаемся загрузить рекомендации из localStorage
            const savedRecommendations = localStorage.getItem('recommendations');

            if (savedRecommendations) {
                this.recommendations = JSON.parse(savedRecommendations);
                console.log('Loaded recommendations from backend:', this.recommendations);
            } else {
                // Если нет сохраненных рекомендаций, используем демо-данные
                console.log('No backend recommendations found, using demo data');
            }

            this.renderRecommendations();

        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    }

    loadUserData() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const data = JSON.parse(userData);
            this.updateUserInfo(data);
        }
    }

    updateUserInfo(userData) {
        // Update display name
        const displayName = document.getElementById('displayName');
        if (displayName && userData.name) {
            displayName.textContent = userData.name;
        }

        // Update mood
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

    renderRecommendations() {
        const grid = document.getElementById('recommendationsGrid');
        if (!grid) {
            console.error('Recommendations grid not found');
            return;
        }

        console.log('Rendering recommendations with data:', this.recommendations);
        grid.innerHTML = this.recommendations.map((event, index) => `
        <div class="recommendation-card" data-id="${event.id || index}">
            <div class="card-image">
                ${event.imageUrl ?
                `<img src="${event.imageUrl}" alt="${event.title}" onerror="this.style.display='none'">` :
                this.getTypeIcon(event.category)
            }
                <div class="place-type">${this.getTypeText(event.category)}</div>
                ${event.price ? `<div class="event-price">${this.formatPrice(event.price)}</div>` : ''}
                <button class="favorite-btn" onclick="recommendationsManager.toggleFavorite(${event.id || index})">
                    <i class="fas ${this.isFavorite(event.id || index) ? 'fa-heart' : 'fa-heart'}"></i>
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
                    <button class="action-btn secondary-action" onclick="recommendationsManager.showDetails(${event.id || index})">
                        <i class="fas fa-info-circle"></i>
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    }

    formatDate(dateString) {
        if (!dateString) return 'Дата не указана';

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
            return 'Дата не указана';
        }
    }

    formatTime(dateString) {
        if (!dateString) return 'Время не указано';

        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.warn('Error formatting time:', e);
            return 'Время не указано';
        }
    }

    // Метод для форматирования цены
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
            music: '🎵'
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
            music: 'Музыка'
        };
        return types[type] || 'Место';
    }

    bindEvents() {
        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });
    }


    toggleFavorite(placeId) {
        const favorites = this.getFavorites();
        const index = favorites.indexOf(placeId);

        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(placeId);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        this.renderRecommendations();

        // Show feedback
        this.showFeedback(
            index > -1 ? 'Убрано из избранного' : 'Добавлено в избранное',
            index > -1 ? 'info' : 'success'
        );
    }

    isFavorite(placeId) {
        const favorites = this.getFavorites();
        return favorites.includes(placeId);
    }

    getFavorites() {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    }


    showDetails(placeId) {
        const place = this.recommendations.find(p => p.id === placeId);
        if (place) {
            // In a real app, this would show a detailed modal
            this.showFeedback(`Подробная информация о "${place.name}"`, 'info');
        }
    }

    showSettings() {
        // In a real app, this would open settings modal
        this.showFeedback('Открытие настроек', 'info');
    }

    showFeedback(message, type = 'info') {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `feedback feedback-${type}`;
        feedback.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add styles
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

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.remove();
            }
        }, 3000);
    }
}

// Initialize recommendations manager
let recommendationsManager;

document.addEventListener('DOMContentLoaded', () => {
    recommendationsManager = new RecommendationsManager();
});