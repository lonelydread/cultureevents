package ru.singularity.cultureevents.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventResponse {
    private Integer id;
    private String title;
    private String description;
    private String category;
    private String city;
    private LocalDateTime date;
    private String location;
    private BigDecimal price;
    private String imageUrl;
}
