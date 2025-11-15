package ru.singularity.cultureevents.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class RecommendationRequest {
    private String city;
    private Map<String, Double> favoriteTags;
    private List<String> favoriteCategories;
    private String preferredMood;
    private String weather;
//    private List<String> preferredAudiences;
    //todo
    // private List<Long> viewedEvents; // ID просмотренных мероприятий (для улучшения рекомендаций)
}
