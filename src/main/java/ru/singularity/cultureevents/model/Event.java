package ru.singularity.cultureevents.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String title;
    private String description;
    private String category;
    private String city;
    private String date;
    private String location;
    private Double price;
    private String imageUrl;

    //todo
    private String mood;
    private String audience;
}
