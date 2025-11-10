package ru.singularity.cultureevents.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.singularity.cultureevents.dto.RecommendationRequest;
import ru.singularity.cultureevents.model.Event;
import ru.singularity.cultureevents.repository.EventRepository;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getPersonalizedRecommendations(RecommendationRequest request) {
        // 1. Получаем базовые мероприятия по городу
        List<Event> baseEvents = eventRepository.findByCityAndDateAfter(
                request.getCity(), LocalDateTime.now()
        ).stream()
                .collect(Collectors.toList());


        // 2. Применяем сложную логику рекомендаций
        baseEvents = baseEvents.stream()
                .filter(event -> matchesUserPreferences(event, request))
                .sorted(Comparator.comparingDouble((Event event) ->
                        calculateRelevanceScore(event, request)).reversed())
                .limit(5)
                .collect(Collectors.toList());
        System.out.println(baseEvents);
        return baseEvents;
    }


    // Проверка соответствия предпочтениям пользователя
    private boolean matchesUserPreferences(Event event, RecommendationRequest request) {
        // Фильтрация по категориям
        if (request.getFavoriteCategories() != null &&
                !request.getFavoriteCategories().isEmpty() &&
                !request.getFavoriteCategories().contains(event.getCategory())) {
            return false;
        }


        // Фильтрация по настроению
        if (request.getPreferredMood() != null &&
                !request.getPreferredMood().isEmpty() &&
                !request.getPreferredMood().contains(event.getMood())) {
            return false;
        }

        // Фильтрация по аудитории
        if (request.getPreferredAudiences() != null &&
                !request.getPreferredAudiences().isEmpty() &&
                event.getAudience() != null &&
                !request.getPreferredAudiences().contains(event.getAudience())) {
            return false;
        }

        return true;
    }

    // Расчет релевантности мероприятия для пользователя
    private double calculateRelevanceScore(Event event, RecommendationRequest request) {
        double score = 0.0;

        //todo Базовый рейтинг популярности
//        score += event.getPopularity() != null ? event.getPopularity() * 0.1 : 0;

        //todo Учет категорий
//        if (request.getFavoriteCategories() != null &&
//                request.getFavoriteCategories().contains(event.getCategory())) {
//            score += 10.0;
//        }

        //todo Учет настроения
//        if (request.getPreferredMood() != null &&
//                request.getPreferredMood().equals(event.getMood())) {
//            score += 5.0;
//        }

        //todo Учет цены (чем дешевле относительно бюджета - тем лучше)
//        if (request.getMaxPrice() != null && event.getPrice() != null) {
//            double priceRatio = 1.0 - (event.getPrice() / request.getMaxPrice());
//            score += Math.max(0, priceRatio * 3.0);
//        }

        //todo Штраф за просмотренные мероприятия
//        if (request.getViewedEvents() != null &&
//                request.getViewedEvents().contains(event.getId())) {
//            score -= 2.0;
//        }

        // Бонус за ближайшие даты
        long daysUntilEvent = java.time.Duration.between(LocalDateTime.now(), event.getDate()).toDays();
        if (daysUntilEvent <= 7) {
            score += 2.0;
        } else if (daysUntilEvent <= 3) {
            score += 4.0;
        } else if (daysUntilEvent <= 1) {
            score += 6.0;
        }

            return score;
        }
}
