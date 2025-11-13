package ru.singularity.cultureevents.dto;

import lombok.Data;
import java.util.List;

@Data
public class RecommendationRequest {
    private String city;
    private List<String> favoriteCategories;
    private String preferredMood;
    private List<String> preferredAudiences;
    //todo
    // private List<Long> viewedEvents; // ID просмотренных мероприятий (для улучшения рекомендаций)
}
