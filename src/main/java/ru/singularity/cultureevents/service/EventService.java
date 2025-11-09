package ru.singularity.cultureevents.service;

import ru.singularity.cultureevents.dto.RecommendationRequest;
import ru.singularity.cultureevents.model.Event;

import java.util.List;

public interface EventService {
    List<Event> getPersonalizedRecommendations(RecommendationRequest request);
    List<Event> getAllEvents();
    List<Event> getEventsByCity(String city);
    List<Event> getEventsByCategory(String category);
    List<Event> getEventsByCityAndCategory(String city, String category);
    List<Event> getRecommendedEvents(String city, String mood, String userId);
    Event getEventById(String id);
}
