package ru.singularity.cultureevents.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.singularity.cultureevents.dto.EventResponse;
import ru.singularity.cultureevents.dto.RecommendationRequest;
import ru.singularity.cultureevents.mapper.EventMapper;
import ru.singularity.cultureevents.model.Event;
import ru.singularity.cultureevents.service.EventService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @PostMapping("/recommendations")
    public ResponseEntity<List<EventResponse>> getPersonalizedRecommendations(
            @RequestBody RecommendationRequest request) {

        List<Event> events = eventService.getPersonalizedRecommendations(request);
        List<EventResponse> response = events.stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
