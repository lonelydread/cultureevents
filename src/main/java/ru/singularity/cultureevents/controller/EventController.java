package ru.singularity.cultureevents.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.singularity.cultureevents.dto.RecommendationRequest;
import ru.singularity.cultureevents.model.Event;
import ru.singularity.cultureevents.service.EventService;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    // Персонализированные рекомендации
    @PostMapping("/recommendations")
    public List<Event> getPersonalizedRecommendations(@RequestBody RecommendationRequest request) {
        return eventService.getPersonalizedRecommendations(request);
    }

    @GetMapping
    public List<Event> getAllEvents(@RequestParam(required = false) String city) {
        // TODO: реализовать
        return null;
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable String id) {
        // TODO: реализовать
        return null;
    }

    @GetMapping("/recommendations")
    public List<Event> getRecommendedEvents(
            @RequestParam String city,
            @RequestParam(required = false) String mood,
            @RequestParam String userId) {
        // TODO: реализовать
        return null;
    }

    @GetMapping("/search")
    public List<Event> searchEvents(
            @RequestParam String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        // TODO: реализовать
        return null;
    }
}
