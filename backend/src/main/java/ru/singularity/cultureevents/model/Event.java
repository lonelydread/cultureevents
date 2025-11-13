package ru.singularity.cultureevents.model;

import lombok.Data;
import jakarta.persistence.*;

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
    private String category; // concert, exhibition, theater, festival, standup

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private LocalDateTime date;


    private String location;
    private BigDecimal price;
    private String imageUrl;

    // Поля для системы рекомендаций
    private String mood; // active, chill, cultural
    private String audience; // friends, couples, family, solo

}