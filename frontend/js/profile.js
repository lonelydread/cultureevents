// Profile functionality
class ProfileManager {
    constructor() {
        this.userData = {};
        this.settings = {};
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadSettings();
        this.bindEvents();
        this.updateProfileInfo();
        this.updateStats();
    }

    loadUserData() {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            this.userData = JSON.parse(savedData);
        }
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            // Default settings
            this.settings = {
                notifications: true,
                darkTheme: false,
                geolocation: true,
                language: 'ru'
            };
        }
        
        this.applySettings();
    }

    applySettings() {
        // Apply theme
        if (this.settings.darkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        // Update toggle switches
        this.updateToggleSwitches();
    }

    updateToggleSwitches() {
        document.querySelectorAll('.switch input').forEach(switchInput => {
            const settingName = this.getSettingNameFromSwitch(switchInput);
            if (settingName && this.settings[settingName] !== undefined) {
                switchInput.checked = this.settings[settingName];
            }
        });
    }

    getSettingNameFromSwitch(switchInput) {
        const label = switchInput.closest('.setting-item').querySelector('.setting-label').textContent;
        if (label.includes('Уведомления')) return 'notifications';
        if (label.includes('Темная тема')) return 'darkTheme';
        if (label.includes('Геолокация')) return 'geolocation';
        return null;
    }

    bindEvents() {
        // Edit profile button
        document.querySelector('.edit-profile-btn')?.addEventListener('click', () => {
            this.editProfile();
        });

        // Section edit buttons
        document.querySelectorAll('.section-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.preferences-section, .achievements-section, .settings-section');
                this.editSection(section);
            });
        });

        // Toggle switches
        document.querySelectorAll('.switch input').forEach(switchInput => {
            switchInput.addEventListener('change', (e) => {
                this.handleSettingChange(e.target);
            });
        });

        // Account actions
        document.querySelectorAll('.account-actions .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.action-btn').textContent.trim();
                this.handleAccountAction(action);
            });
        });

        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });

        // Avatar edit
        document.querySelector('.avatar-edit-btn')?.addEventListener('click', () => {
            this.changeAvatar();
        });
    }

    updateProfileInfo() {
        // Update display name in header
        const displayName = document.getElementById('displayName');
        if (displayName && this.userData.name) {
            displayName.textContent = this.userData.name;
        }

        // Update mood in header
        const userMood = document.getElementById('userMood');
        if (userMood && this.userData.mood) {
            const moodText = this.getMoodText(this.userData.mood);
            userMood.textContent = moodText;
        }

        // Update profile name
        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.textContent = this.userData.name;
        }

        // Update preferences tags
        this.updatePreferenceTags();
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

    updatePreferenceTags() {
        const tagsContainer = document.getElementById('preferenceTags');
        if (!tagsContainer) return;

        const interestTags = {
            food: '🍕 Еда',
            nature: '🌳 Природа',
            culture: '🎭 Культура',
            sports: '⚽ Спорт',
            shopping: '🛍️ Шоппинг',
            entertainment: '🎮 Развлечения',
            art: '🎨 Искусство',
            library: '📚 Библиотеки'
        };

        const userInterests = this.userData.interests || [];
        tagsContainer.innerHTML = userInterests
            .map(interest => `<span class="tag">${interestTags[interest] || interest}</span>`)
            .join('');
    }

    updateStats() {
        // Visited places
        const visitedPlaces = document.getElementById('visitedPlaces');
        if (visitedPlaces) {
            // In real app, this would come from history
            visitedPlaces.textContent = '24';
        }

        // Favorites count
        const favoritesCount = document.getElementById('favoritesCount');
        if (favoritesCount) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            favoritesCount.textContent = favorites.length;
        }

        // Days active (mock data)
        const daysActive = document.getElementById('daysActive');
        if (daysActive) {
            daysActive.textContent = '127';
        }
    }

    editProfile() {
        this.showFeedback('Редактирование профиля', 'info');
        // In real app, this would open a profile edit modal
    }

    editSection(section) {
        const sectionTitle = section.querySelector('h3').textContent;
        this.showFeedback(`Редактирование: ${sectionTitle}`, 'info');
        // In real app, this would open specific edit modals
    }

    handleSettingChange(switchInput) {
        const settingName = this.getSettingNameFromSwitch(switchInput);
        if (settingName) {
            this.settings[settingName] = switchInput.checked;
            this.saveSettings();
            this.applySettings();
            
            let message = '';
            switch (settingName) {
                case 'notifications':
                    message = `Уведомления ${switchInput.checked ? 'включены' : 'выключены'}`;
                    break;
                case 'darkTheme':
                    message = `Темная тема ${switchInput.checked ? 'включена' : 'выключена'}`;
                    break;
                case 'geolocation':
                    message = `Геолокация ${switchInput.checked ? 'включена' : 'выключена'}`;
                    break;
            }
            
            if (message) {
                this.showFeedback(message, 'success');
            }
        }
    }

    handleAccountAction(action) {
        switch (action) {
            case 'Помощь и поддержка':
                this.showHelp();
                break;
            case 'Оценить приложение':
                this.rateApp();
                break;
            case 'Выйти из аккаунта':
                this.logout();
                break;
        }
    }

    showHelp() {
        this.showFeedback('Открытие раздела помощи', 'info');
        // In real app, this would navigate to help section
    }

    rateApp() {
        this.showFeedback('Открытие магазина приложений для оценки', 'info');
        // In real app, this would open app store rating
    }

    logout() {
        if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
            // Clear user data
            localStorage.removeItem('userData');
            localStorage.removeItem('favorites');
            localStorage.removeItem('visits');
            
            this.showFeedback('Выход из аккаунта...', 'info');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    changeAvatar() {
        this.showFeedback('Смена аватара', 'info');
        // In real app, this would open avatar selection/upload
    }

    showSettings() {
        this.showFeedback('Открытие настроек', 'info');
    }

    saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(this.settings));
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

// Initialize profile manager
let profileManager;

document.addEventListener('DOMContentLoaded', () => {
    profileManager = new ProfileManager();
});