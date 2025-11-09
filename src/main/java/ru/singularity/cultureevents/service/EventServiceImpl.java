package ru.singularity.cultureevents.service;

import ru.singularity.cultureevents.model.Event;
import ru.singularity.cultureevents.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    public List<Event> getAllEvents() {
        // TODO: реализовать
        return null;
    }

    @Override
    public List<Event> getEventsByCity(String city) {
        // TODO: реализовать
        return null;
    }

    @Override
    public List<Event> getEventsByCategory(String category) {
        // TODO: реализовать
        return null;
    }

    @Override
    public List<Event> getEventsByCityAndCategory(String city, String category) {
        // TODO: реализовать
        return null;
    }

    @Override
    public List<Event> getRecommendedEvents(String city, String mood, String userId) {
        // TODO: реализовать логику рекомендаций
        return null;
    }

    @Override
    public Event getEventById(String id) {
        // TODO: реализовать
        return null;
    }
}
