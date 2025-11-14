package ru.singularity.cultureevents.model;

import jakarta.persistence.*;
import lombok.Data;
import ru.singularity.cultureevents.converter.StringArrayConverter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category; // основная категория: nature, art, culture, sports, science, music


    @Convert(converter = StringArrayConverter.class)
    private String[] tags; // несколько тегов: nature, art, culture, sports, science, music


    @Column(nullable = false)
    private String city;


    private LocalDateTime date;


    private String location;
    private BigDecimal price;
    private String imageUrl;

    // Поля для системы рекомендаций
    @Convert(converter = StringArrayConverter.class)
    private String[] moods; // active, relaxed, social, creative

    private boolean weather_dependent;

}