// History functionality
class HistoryManager {
    constructor() {
        this.visits = [];
        this.filterPeriod = 'all';
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadHistory();
        this.bindEvents();
        this.updateStats();
        this.renderTimeline();
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

    loadHistory() {
        // Mock history data - in real app this would come from localStorage or API
        this.visits = [
            {
                id: 1,
                placeId: 1,
                placeName: 'Кофейня "Уютный уголок"',
                type: 'cafe',
                date: new Date(),
                time: '14:30',
                rating: 5.0,
                notes: 'Отличный кофе и уютная атмосфера. Обязательно вернусь!',
                tags: ['Работа', 'Встреча']
            },
            {
                id: 2,
                placeId: 3,
                placeName: 'Центральный парк культуры',
                type: 'park',
                date: new Date(),
                time: '11:00',
                rating: 4.5,
                notes: 'Прекрасное место для утренней пробежки. Чистый воздух и красивые виды.',
                tags: ['Спорт', 'Отдых']
            },
            {
                id: 3,
                placeId: 6,
                placeName: 'Кинотеатр "Звезда"',
                type: 'entertainment',
                date: new Date(Date.now() - 86400000), // yesterday
                time: '20:15',
                rating: 4.0,
                notes: 'Посмотрели новый блокбастер. Отличный звук и комфортные кресла.',
                tags: ['Развлечения', 'Свидание']
            },
            {
                id: 4,
                placeId: 7,
                placeName: 'Пиццерия "Итальянский уголок"',
                type: 'cafe',
                date: new Date(Date.now() - 86400000),
                time: '18:30',
                rating: 5.0,
                notes: 'Вкуснейшая пицца и дружелюбный персонал. Отличное место для ужина с друзьями.',
                tags: ['Ужин', 'Компания']
            },
            {
                id: 5,
                placeId: 4,
                placeName: 'Библиотека им. Горького',
                type: 'library',
                date: new Date(Date.now() - 2 * 86400000), // 2 days ago
                time: '15:00',
                rating: 4.0,
                notes: 'Тихое место для работы. Удобные рабочие места и хороший Wi-Fi.',
                tags: ['Работа', 'Учеба']
            }
        ];
    }

    bindEvents() {
        // Timeline filters
        document.querySelectorAll('.timeline-filter').forEach(filter => {
            filter.addEventListener('click', (e) => {
                this.handleFilterChange(e.target);
            });
        });

        // Timeline actions
        document.querySelectorAll('.timeline-actions .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.action-btn').textContent.trim();
                this.handleTimelineAction(action);
            });
        });

        // Visit actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-small')) {
                const btn = e.target.closest('.btn-small');
                const action = btn.textContent.trim();
                const visitCard = btn.closest('.visit-card');
                const visitId = parseInt(visitCard.closest('.timeline-item').dataset.id);
                
                this.handleVisitAction(visitId, action);
            }
        });

        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });
    }

    handleFilterChange(filter) {
        // Remove active class from all filters
        document.querySelectorAll('.timeline-filter').forEach(f => {
            f.classList.remove('active');
        });
        
        // Add active class to clicked filter
        filter.classList.add('active');
        
        // Update filter period
        this.filterPeriod = filter.dataset.period;
        this.renderTimeline();
    }

    handleTimelineAction(action) {
        switch (action) {
            case 'Экспорт':
                this.exportHistory();
                break;
            case 'Очистить историю':
                this.clearHistory();
                break;
        }
    }

    handleVisitAction(visitId, action) {
        const visit = this.visits.find(v => v.id === visitId);
        if (!visit) return;

        switch (action) {
            case 'Посетить снова':
                this.visitAgain(visit);
                break;
            case 'Редактировать':
                this.editVisit(visit);
                break;
        }
    }

    renderTimeline() {
        const timelineContainer = document.querySelector('.history-timeline');
        if (!timelineContainer) return;

        const filteredVisits = this.filterVisitsByPeriod();
        const groupedVisits = this.groupVisitsByDate(filteredVisits);
        
        timelineContainer.innerHTML = this.renderTimelineSections(groupedVisits);
        this.toggleEmptyState();
    }

    filterVisitsByPeriod() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (this.filterPeriod) {
            case 'today':
                return this.visits.filter(visit => 
                    new Date(visit.date).toDateString() === today.toDateString()
                );
            case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 86400000);
                return this.visits.filter(visit => new Date(visit.date) >= weekAgo);
            case 'month':
                const monthAgo = new Date(today.getTime() - 30 * 86400000);
                return this.visits.filter(visit => new Date(visit.date) >= monthAgo);
            default:
                return this.visits;
        }
    }

    groupVisitsByDate(visits) {
        const groups = {};
        
        visits.forEach(visit => {
            const date = new Date(visit.date);
            const dateKey = date.toDateString();
            
            if (!groups[dateKey]) {
                groups[dateKey] = {
                    date: date,
                    visits: []
                };
            }
            
            groups[dateKey].visits.push(visit);
        });
        
        return groups;
    }

    renderTimelineSections(groups) {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        return Object.entries(groups).map(([dateKey, group]) => {
            const visitsCount = group.visits.length;
            let sectionTitle = '';
            
            if (dateKey === today) {
                sectionTitle = 'Сегодня';
            } else if (dateKey === yesterday) {
                sectionTitle = 'Вчера';
            } else {
                sectionTitle = this.formatDate(group.date);
            }
            
            return `
                <div class="timeline-section">
                    <div class="timeline-header">
                        <h3 class="timeline-date">${sectionTitle}</h3>
                        <span class="visits-count">${visitsCount} посещений</span>
                    </div>
                    <div class="timeline-items">
                        ${group.visits.map(visit => this.renderVisitItem(visit)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderVisitItem(visit) {
        return `
            <div class="timeline-item" data-id="${visit.id}">
                <div class="timeline-marker">
                    <div class="marker-icon">${this.getTypeIcon(visit.type)}</div>
                    <div class="timeline-line"></div>
                </div>
                <div class="timeline-content">
                    <div class="visit-card">
                        <div class="visit-header">
                            <h4>${visit.placeName}</h4>
                            <div class="visit-time">${visit.time}</div>
                        </div>
                        <div class="visit-details">
                            <div class="visit-rating">
                                <div class="stars">
                                    ${this.renderStars(visit.rating)}
                                </div>
                                <span class="rating-text">${visit.rating}</span>
                            </div>
                            <p class="visit-notes">${visit.notes}</p>
                            <div class="visit-tags">
                                ${visit.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <div class="visit-actions">
                            <button class="btn-small outline">
                                <i class="fas fa-redo"></i>
                                Посетить снова
                            </button>
                            <button class="btn-small outline">
                                <i class="fas fa-edit"></i>
                                Редактировать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTypeIcon(type) {
        const icons = {
            cafe: '☕',
            park: '🌳',
            entertainment: '🎬',
            library: '📚',
            art: '🎨',
            sports: '⚽',
            shopping: '🛍️'
        };
        return icons[type] || '📍';
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    formatDate(date) {
        return date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateStats() {
        const totalVisits = document.getElementById('totalVisits');
        if (totalVisits) {
            totalVisits.textContent = this.visits.length;
        }
        
        // Calculate average rating
        const averageRating = this.visits.length > 0 
            ? (this.visits.reduce((sum, visit) => sum + visit.rating, 0) / this.visits.length).toFixed(1)
            : 0;
        
        // Calculate unique places
        const uniquePlaces = new Set(this.visits.map(visit => visit.placeId)).size;
        
        // Update other stats as needed
        console.log('Average rating:', averageRating);
        console.log('Unique places:', uniquePlaces);
    }

    toggleEmptyState() {
        const emptyState = document.getElementById('emptyHistory');
        const timeline = document.querySelector('.history-timeline');
        
        if (emptyState && timeline) {
            const filteredVisits = this.filterVisitsByPeriod();
            if (filteredVisits.length === 0) {
                emptyState.classList.remove('hidden');
                timeline.classList.add('hidden');
            } else {
                emptyState.classList.add('hidden');
                timeline.classList.remove('hidden');
            }
        }
    }

    visitAgain(visit) {
        this.showFeedback(`Добавлено в планы: "${visit.placeName}"`, 'success');
        // In real app, this would add to planned visits
    }

    editVisit(visit) {
        this.showFeedback(`Редактирование посещения: "${visit.placeName}"`, 'info');
        // In real app, this would open an edit modal
    }

    exportHistory() {
        const historyText = this.visits.map(visit => 
            `${this.formatDate(new Date(visit.date))} ${visit.time} - ${visit.placeName} (${visit.rating}⭐)`
        ).join('\n');
        
        const blob = new Blob([historyText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'max-togo-history.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showFeedback('История экспортирована', 'success');
    }

    clearHistory() {
        if (confirm('Вы уверены, что хотите очистить всю историю посещений?')) {
            this.visits = [];
            localStorage.removeItem('visits'); // In real app
            this.renderTimeline();
            this.updateStats();
            this.showFeedback('История очищена', 'info');
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

// Initialize history manager
let historyManager;

document.addEventListener('DOMContentLoaded', () => {
    historyManager = new HistoryManager();
});