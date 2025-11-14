// Survey functionality
class SurveyManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.userData = {
            name: 'Друг',
            mood: '',
            weather: '',
            interests: []
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
    }

    bindEvents() {
        // Start survey button
        document.querySelector('.start-survey')?.addEventListener('click', () => {
            this.nextStep();
        });

        // Next buttons
        document.querySelectorAll('.next-card').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        // Previous buttons
        document.querySelectorAll('.prev-card').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        // Mood selection
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectOption('mood', e.target.closest('.mood-option'));
            });
        });

        // Weather selection
        document.querySelectorAll('.weather-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectOption('weather', e.target.closest('.weather-option'));
            });
        });

        // Interests selection (multiple)
        document.querySelectorAll('.interest-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.toggleInterest(e.target.closest('.interest-option'));
            });
        });

        // Show recommendations button (последняя карточка)
        document.querySelector('.show-main')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.sendRecommendationsRequest();
        });

        // Swipe gestures for mobile
        this.setupSwipeGestures();
    }

    selectOption(type, element) {
        // Remove selection from all options in this group
        element.closest('.mood-options, .weather-options')
            ?.querySelectorAll('.mood-option, .weather-option')
            .forEach(opt => opt.classList.remove('selected'));

        // Add selection to clicked option
        element.classList.add('selected');

        // Enable next button
        const nextBtn = element.closest('.survey-card').querySelector('.next-card');
        nextBtn.disabled = false;

        // Save data
        this.userData[type] = element.dataset[type];
    }

    toggleInterest(element) {
        element.classList.toggle('selected');
        const interest = element.dataset.interest;

        if (element.classList.contains('selected')) {
            this.userData.interests.push(interest);
        } else {
            this.userData.interests = this.userData.interests.filter(i => i !== interest);
        }

        // Enable next button if at least one interest is selected
        const nextBtn = element.closest('.survey-card').querySelector('.next-card');
        nextBtn.disabled = this.userData.interests.length === 0;
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.hideCurrentCard();
            this.currentStep++;
            this.showCurrentCard();
            this.updateProgress();

            // Save to localStorage on completion
            if (this.currentStep === this.totalSteps) {
                this.saveUserData();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.hideCurrentCard('left');
            this.currentStep--;
            this.showCurrentCard('left');
            this.updateProgress();
        }
    }

    hideCurrentCard(direction = 'right') {
        const currentCard = document.querySelector(`.survey-card[data-step="${this.currentStep}"]`);
        currentCard.classList.remove('active');
        currentCard.classList.add(direction === 'right' ? 'exit-left' : 'exit-right');

        setTimeout(() => {
            currentCard.classList.remove('exit-left', 'exit-right');
        }, 300);
    }

    showCurrentCard(direction = 'right') {
        setTimeout(() => {
            const nextCard = document.querySelector(`.survey-card[data-step="${this.currentStep}"]`);
            nextCard.classList.add('active');
        }, 300);
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progress = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
    }


    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
        console.log('User data saved:', this.userData);
    }

    sendRecommendationsRequest() {
        console.log('Starting sendRecommendationsRequest...');

        this.showLoadingState();

        const requestData = {
            city: "Москва",
            favoriteCategories: this.userData.interests,
            preferredMood: this.userData.mood,
            weather: this.userData.weather
        };

        console.log('Sending request to backend:', requestData);

        fetch('http://localhost:8080/api/events/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(recommendations => {
                console.log('Received recommendations:', recommendations);

                // Сохраняем и перенаправляем
                localStorage.setItem('recommendations', JSON.stringify(recommendations));
                window.location.href = 'recommendations.html';
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
                this.showError('Не удалось загрузить рекомендации. Пожалуйста, попробуйте позже.');
                this.hideLoadingState();
            });
    }

    showLoadingState() {
        const button = document.querySelector('.show-main');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
            button.disabled = true;

            // Восстанавливаем кнопку через 5 секунд на случай ошибки
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 5000);
        }
    }

    showError(message) {
        // Создаем элемент для отображения ошибки
        const errorDiv = document.createElement('div');
        errorDiv.className = 'feedback feedback-error';
        errorDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #f44336;
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

        document.body.appendChild(errorDiv);

        // Автоматически удаляем через 5 секунд
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    setupSwipeGestures() {
        let startX = 0;
        let endX = 0;
        const container = document.querySelector('.cards-container');

        if (!container) return;

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });

        // Mouse events for desktop testing
        container.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            document.addEventListener('mouseup', handleMouseUp);
        });

        const handleMouseUp = (e) => {
            endX = e.clientX;
            this.handleSwipe(startX, endX);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const minSwipeDistance = 50;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                // Swipe left - next
                this.nextStep();
            } else {
                // Swipe right - previous
                this.prevStep();
            }
        }
    }
}

// Initialize survey when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    new SurveyManager();
});