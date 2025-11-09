package ru.singularity.cultureevents.model;



@Data
public class UserPreferences {
    private String userId;
    private List<String> favoriteCategories;
    private List<String> preferredLocations;
}
