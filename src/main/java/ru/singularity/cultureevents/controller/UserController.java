package ru.singularity.cultureevents.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.singularity.cultureevents.model.UserPreferences;
import ru.singularity.cultureevents.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}/preferences")
    public UserPreferences getUserPreferences(@PathVariable String userId) {
        // TODO: реализовать
        return null;
    }

    @PostMapping("/{userId}/preferences")
    public UserPreferences saveUserPreferences(
            @PathVariable String userId,
            @RequestBody UserPreferences preferences) {
        // TODO: реализовать
        return null;
    }

    @PostMapping("/{userId}/favorites/{eventId}")
    public void addToFavorites(
            @PathVariable String userId,
            @PathVariable String eventId) {
        // TODO: реализовать
    }

    @DeleteMapping("/{userId}/favorites/{eventId}")
    public void removeFromFavorites(
            @PathVariable String userId,
            @PathVariable String eventId) {
        // TODO: реализовать
    }
}
