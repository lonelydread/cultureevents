package ru.singularity.cultureevents.service;

import ru.singularity.cultureevents.model.UserPreferences;

public interface UserService {
    UserPreferences getUserPreferences(String userId);
    UserPreferences saveUserPreferences(String userId, UserPreferences preferences);
}
