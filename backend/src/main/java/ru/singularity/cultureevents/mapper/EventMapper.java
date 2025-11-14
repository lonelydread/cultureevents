package ru.singularity.cultureevents.mapper;

import ru.singularity.cultureevents.model.Event;
import org.springframework.stereotype.Component;
import ru.singularity.cultureevents.dto.EventResponse;

@Component
public class EventMapper {
    public EventResponse toResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setCategory(event.getCategory());
        response.setCity(event.getCity());
        response.setDate(event.getDate());
        response.setLocation(event.getLocation());
        response.setPrice(event.getPrice());
        response.setImageUrl(event.getImageUrl());
        return response;
    }
}
