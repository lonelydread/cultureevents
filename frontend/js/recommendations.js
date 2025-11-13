// Recommendations functionality
class RecommendationsManager {
    constructor() {
        this.recommendations = [];
        this.filters = {
            proximity: 'all',
            price: 'all',
            time: 'all',
            rating: 'all'
        };
        this.init();
    }

    init() {
        this.loadUserData();
        this.generateRecommendations();
        this.bindEvents();
        this.updateResultsCount();
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

    generateRecommendations() {
        // Mock data - in real app this would come from an API
        this.recommendations = [
            {
                id: 1,
                name: 'Центральный парк культуры',
                type: 'park',
                description: 'Просторный парк с озерами, велодорожками и зонами для пикника. Идеально для активного отдыха.',
                distance: 1.2,
                rating: 4.8,
                hours: '6:00-23:00',
                price: 'free',
                tags: ['Велодорожки', 'Озеро', 'Пикник']
            },
            {
                id: 2,
                name: 'Галерея современного искусства',
                type: 'art',
                description: 'Современные выставки, инсталляции и мастер-классы. Вдохновляющая атмосфера для творческих натур.',
                distance: 0.8,
                rating: 4.6,
                hours: '11:00-20:00',
                price: 'medium',
                tags: ['Выставки', 'Мастер-классы', 'Интерактивно']
            },
            {
                id: 3,
                name: 'Кофейня "Уютный уголок"',
                type: 'cafe',
                description: 'Атмосферное место с авторским кофе и домашней выпечкой. Бесплатный Wi-Fi и розетки.',
                distance: 0.5,
                rating: 4.9,
                hours: '7:00-23:00',
                price: 'low',
                tags: ['Wi-Fi', 'Веганское меню', 'Рабочее место']
            },
            {
                id: 4,
                name: 'Спортивный комплекс "Энергия"',
                type: 'sports',
                description: 'Современный фитнес-центр с бассейном, тренажерным залом и групповыми занятиями.',
                distance: 2.1,
                rating: 4.7,
                hours: '6:00-24:00',
                price: 'high',
                tags: ['Бассейн', 'Тренажеры', 'Групповые занятия']
            },
            {
                id: 5,
                name: 'Торговый центр "Стиль"',
                type: 'shopping',
                description: 'Более 200 магазинов, фудкорт и кинотеатр. Есть подземная парковка.',
                distance: 3.2,
                rating: 4.5,
                hours: '10:00-22:00',
                price: 'medium',
                tags: ['Шоппинг', 'Фудкорт', 'Кинотеатр']
            },
            {
                id: 6,
                name: 'Кинотеатр "Звезда"',
                type: 'entertainment',
                description: 'Новейшие фильмы в комфортных залах с системой Dolby Atmos. Есть залы для детей.',
                distance: 1.8,
                rating: 4.4,
                hours: '9:00-2:00',
                price: 'medium',
                tags: ['Кино', 'Детские залы', 'Dolby Atmos']
            }
        ];

        this.renderRecommendations();
    }

    renderRecommendations() {
        const grid = document.getElementById('recommendationsGrid');
        if (!grid) return;

        const filteredRecommendations = this.filterRecommendations();
        
        grid.innerHTML = filteredRecommendations.map(place => `
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
                    <div class="card-details">
                        <div class="detail-item">
                            <i class="fas fa-walking"></i>
                            <span>${place.distance} км</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-star"></i>
                            <span>${place.rating}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${place.hours}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="action-btn primary-action" onclick="recommendationsManager.showRoute(${place.id})">
                            <i class="fas fa-route"></i>
                            Маршрут
                        </button>
                        <button class="action-btn secondary-action" onclick="recommendationsManager.showDetails(${place.id})">
                            <i class="fas fa-info-circle"></i>
                            Подробнее
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterRecommendations() {
        return this.recommendations.filter(place => {
            // Proximity filter
            if (this.filters.proximity !== 'all') {
                const maxDistance = parseFloat(this.filters.proximity);
                if (place.distance > maxDistance) return false;
            }

            // Rating filter
            if (this.filters.rating !== 'all') {
                const minRating = parseFloat(this.filters.rating);
                if (place.rating < minRating) return false;
            }

            // Add more filter logic as needed

            return true;
        });
    }

    getTypeIcon(type) {
        const icons = {
            park: '🌳',
            art: '🎨',
            cafe: '☕',
            sports: '⚽',
            shopping: '🛍️',
            entertainment: '🎬'
        };
        return icons[type] || '📍';
    }

    getTypeText(type) {
        const types = {
            park: 'Парк',
            art: 'Искусство',
            cafe: 'Кафе',
            sports: 'Спорт',
            shopping: 'Шоппинг',
            entertainment: 'Развлечения'
        };
        return types[type] || 'Место';
    }

    bindEvents() {
        // Filter changes
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleFilterChange(e.target);
            });
        });

        // Reset filters
        document.querySelector('.filter-reset')?.addEventListener('click', () => {
            this.resetFilters();
        });

        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });
    }

    handleFilterChange(select) {
        const filterType = select.previousElementSibling.textContent.toLowerCase();
        let filterKey = '';
        
        if (filterType.includes('близость')) filterKey = 'proximity';
        else if (filterType.includes('ценовой')) filterKey = 'price';
        else if (filterType.includes('время')) filterKey = 'time';
        else if (filterType.includes('рейтинг')) filterKey = 'rating';
        
        if (filterKey) {
            this.filters[filterKey] = select.value;
            this.renderRecommendations();
            this.updateResultsCount();
        }
    }

    resetFilters() {
        document.querySelectorAll('.filter-select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        this.filters = {
            proximity: 'all',
            price: 'all',
            time: 'all',
            rating: 'all'
        };
        
        this.renderRecommendations();
        this.updateResultsCount();
    }

    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            const filteredCount = this.filterRecommendations().length;
            countElement.textContent = filteredCount;
        }
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

    showRoute(placeId) {
        const place = this.recommendations.find(p => p.id === placeId);
        if (place) {
            // In a real app, this would open a maps application
            this.showFeedback(`Построение маршрута до "${place.name}"`, 'info');
        }
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