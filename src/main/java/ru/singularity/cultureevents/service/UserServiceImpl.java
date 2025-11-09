package ru.singularity.cultureevents.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.singularity.cultureevents.model.UserPreferences;
import ru.singularity.cultureevents.repository.UserPreferencesRepository;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserPreferencesRepository userPreferencesRepository;

    @Override
    public UserPreferences getUserPreferences(String userId) {
        // TODO: реализовать
        return null;
    }

    @Override
    public UserPreferences saveUserPreferences(String userId, UserPreferences preferences) {
        // TODO: реализовать
        return null;
    }

    @Override
    public void addToFavorites(String userId, String eventId) {
        // TODO: реализовать
    }

    @Override
    public void removeFromFavorites(String userId, String eventId) {
        // TODO: реализовать
    }
}
