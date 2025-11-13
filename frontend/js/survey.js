// Survey functionality
class SurveyManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5; // Было 6, теперь 5
        this.userData = {
            name: 'Друг', // Устанавливаем имя по умолчанию
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

        // Skip survey
        document.getElementById('skipSurvey')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.skipSurvey();
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

    skipSurvey() {
        // Set default user data
        this.userData = {
            name: 'Друг',
            mood: 'relaxed',
            weather: 'sunny',
            interests: ['food', 'nature']
        };
        this.saveUserData();
        
        // Redirect to recommendations
        window.location.href = 'recommendations.html';
    }

    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
        console.log('User data saved:', this.userData);
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
    new SurveyManager();
});