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
        this.updateResultsCount();
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
        if (!grid) return;
        
        grid.innerHTML = this.recommendations.map(place => `
            <div class="recommendation-card" data-id="${place.id}">
                <div class="card-image">
                    ${this.getTypeIcon(place.type)}
                    <div class="place-type">${this.getTypeText(place.type)}</div>
                    <button class="favorite-btn" onclick="recommendationsManager.toggleFavorite(${place.id})">
                        <i class="${this.isFavorite(place.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="card-content">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                    <div class="card-actions">
                        <button class="action-btn secondary-action" onclick="recommendationsManager.showDetails(${place.id})">
                            <i class="fas fa-info-circle"></i>
                            Подробнее
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }


    getTypeIcon(type) {
        const icons = {
            nature: '🌳',
            art: '🎨',
            culture: '🎭',
            sports: '⚽',
            science: '🔬',
            music: '🎵'
        };
        return icons[type] || '📍';
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