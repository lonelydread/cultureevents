package ru.singularity.cultureevents.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.singularity.cultureevents.dto.RecommendationRequest;
import ru.singularity.cultureevents.engine.RecommendationEngine;
import ru.singularity.cultureevents.model.Event;
import ru.singularity.cultureevents.repository.EventRepository;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RecommendationEngine recommendationEngine;

    public List<Event> getPersonalizedRecommendations(RecommendationRequest request) {
        // 1. Получаем базовые мероприятия по городу
        List<Event> baseEvents = eventRepository.findByCityAndDateAfterOrderByDateAsc(
                        request.getCity(), LocalDateTime.now()
                ).stream()
                .filter(p -> {
                    String[] weatherArray = p.getWeather();

                    String currentWeather = Parser.parseWeather(p.getCity());
                    Set<String> weatherSet = Set.of(weatherArray);

                    return weatherSet.contains("any") || weatherSet.contains(currentWeather);
                })
                .collect(Collectors.toList());


        // 2. Преобразуем запрос пользователя в вектор предпочтений
        Map<String, Double> userVector = recommendationEngine.requestToVector(request);

        // 3. Для каждого события вычисляем косинусную схожесть
        List<ScoredEvent> scoredEvents = baseEvents.stream()
                .map(event -> {
                    Map<String, Double> eventVector = recommendationEngine.eventToVector(event);
                    double similarity = recommendationEngine.cosineSimilarity(userVector, eventVector);
                    return new ScoredEvent(event, similarity);
                })
                .collect(Collectors.toList());

        // 4. Фильтруем и сортируем по схожести
        return scoredEvents.stream()
                .filter(scoredEvent -> scoredEvent.score >= 0.1) // Минимальный порог схожести
                .sorted(Comparator.comparingDouble((ScoredEvent se) -> se.score).reversed())
                .limit(8) // Топ-8 самых релевантных
                .map(ScoredEvent::getEvent)
                .collect(Collectors.toList());
    }

    /**
     * Вспомогательный класс для хранения события с оценкой схожести
     */
    @Data
    private static class ScoredEvent {
        final Event event;
        final double score;
    }
}
