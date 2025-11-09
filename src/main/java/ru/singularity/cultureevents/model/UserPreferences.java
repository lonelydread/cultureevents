package ru.singularity.cultureevents.model;


import lombok.Data;
import java.util.List;

@Data
public class UserPreferences {
    private String userId;
    private List<String> favoriteCategories;
    private List<String> preferredLocations;
}
