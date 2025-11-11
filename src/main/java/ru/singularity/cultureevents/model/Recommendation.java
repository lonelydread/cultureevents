package ru.singularity.cultureevents.model;

import java.util.*;
import java.util.stream.Collectors;

public class Recommendation{

    public static void main(String[] args) {
        // предпочтения пользователя
        Map<String, Double> userPrefs = Map.of(
                "food", 0.7,
                "outdoor", 0.9,
                "active", 0.8,
                "culture", 0.4,
                "romantic", 0.5,
                "fun", 0.6,
                "calm", 0.7
        );

        // настроение пользователя (поесть, погулять, активно)
        String moodFilter = "погулять";

        // погода (для простоты: sunny, rainy, snowy)
        String weather = "sunny";

        // база мест
        List<Place> places = List.of(
                new Place("Прогулка в Летнем саду", Map.of("outdoor", 1.0, "nature", 1.0, "walk", 1.0, "calm", 1.0), Set.of("погулять"), Set.of("sunny","cloudy")),
                new Place("Кофейня с видом на Неву", Map.of("food", 1.0, "indoor", 1.0, "romantic", 1.0), Set.of("поесть"), Set.of("sunny","rainy","cloudy")),
                new Place("Ночной бар «Синий кит»", Map.of("fun", 1.0, "indoor", 1.0, "nightlife", 1.0), Set.of("веселиться"), Set.of("any")),
                new Place("Поездка на велосипеде вдоль Финского залива", Map.of("outdoor",1.0,"active",1.0,"sport",1.0), Set.of("активно"), Set.of("sunny","cloudy")),
                new Place("Посещение музея истории", Map.of("indoor",1.0,"culture",1.0,"calm",1.0), Set.of("погулять","культура"), Set.of("any"))
        );

        // фильтрация по настроению и погоде
        List<Place> filtered = places.stream()
                .filter(p -> p.moods.contains(moodFilter))
                .filter(p -> p.weather.contains(weather) || p.weather.contains("any"))
                .collect(Collectors.toList());

        //сортировка по косинуснуму сходству
        filtered.sort((a,b) -> Double.compare(cosineSimilarity(userPrefs,b.tags), cosineSimilarity(userPrefs,a.tags)));

        // ну и тут где-то вывод рекомендаций

    }

    // хранение информации о месте
    static class Place {
        String title;
        Map<String, Double> tags;
        Set<String> moods;
        Set<String> weather;

        Place(String title, Map<String, Double> tags, Set<String> moods, Set<String> weather){
            this.title = title;
            this.tags = tags;
            this.moods = moods;
            this.weather = weather;
        }
    }

    // косинусное сходство между предпочтениями пользователя и местом
    private static double cosineSimilarity(Map<String, Double> userPrefs, Map<String, Double> placeTags){
        double dot = 0, moduleUser=0, modulePlace=0; //скалярное произведение и модули векторов в квадрате
        for(String key : userPrefs.keySet()){ //перебор тегов u - user preferences, p - place tags 
            double u = userPrefs.getOrDefault(key,0.0);
            double p = placeTags.getOrDefault(key,0.0);
            dot += u*p;
            moduleUser += u*u;
            modulePlace += p*p;
        }
        if(moduleUser==0 || modulePlace==0) return 0.0; //чтобы не делить на ноль
        return dot / (Math.sqrt(moduleUser) * Math.sqrt(modulePlace)); //косинус считаем из векторного произведения векторов
    }
}
