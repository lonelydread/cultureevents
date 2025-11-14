package ru.singularity.cultureevents.engine;

import ru.singularity.cultureevents.dto.RecommendationRequest;
import ru.singularity.cultureevents.model.Event;

import java.util.HashMap;
import java.util.Map;

public class RecommendationEngine {

    private static final double CATEGORY_WEIGHT = 1.0;
    private static final double MOOD_WEIGHT = 0.5;
    /**
     * Вычисляет косинусную схожесть между предпочтениями пользователя и тегами мероприятия
     */
    public double cosineSimilarity(Map<String, Double> userPrefs, Map<String, Double> placeTags) {
        double dot = 0, moduleUser = 0, modulePlace = 0;

        for (String key : userPrefs.keySet()) {
            double u = userPrefs.getOrDefault(key, 0.0);
            double p = placeTags.getOrDefault(key, 0.0);
            dot += u * p;
            moduleUser += u * u;
            modulePlace += p * p;
        }

        if (moduleUser == 0 || modulePlace == 0) return 0.0;
        return dot / (Math.sqrt(moduleUser) * Math.sqrt(modulePlace));
    }

    /**
     * Преобразует событие в вектор тегов для косинусной схожести
     */
    public Map<String, Double> eventToVector(Event event) {
        Map<String, Double> vector = new HashMap<>();

        // Категория (самый важный признак)
        for (String category : event.getCategories()) {
            vector.put(category, CATEGORY_WEIGHT);
        }

        // Настроение
        for (String mood : event.getMoods()) {
            vector.put(mood, MOOD_WEIGHT);
        }


        // Аудитория
//        for (String audience : event.getAudiences()) {
//            vector.put(audience, AUDIENCE_WEIGHT);
//        }


        return vector;
    }

    /**
     * Преобразует запрос пользователя в вектор предпочтений
     */
    public Map<String, Double> requestToVector(RecommendationRequest request) {
        Map<String, Double> vector = new HashMap<>();

        // Любимые категории

            for (String category : request.getFavoriteCategories()) {
                vector.put(category, CATEGORY_WEIGHT);
            }


        // Предпочтительное настроение
            vector.put(request.getPreferredMood(), MOOD_WEIGHT);


        // Предпочтительная аудитория
//            for (String audience : request.getPreferredAudiences()) {
//                vector.put(audience, AUDIENCE_WEIGHT);
//        }


        return vector;
    }

}
