package ru.singularity.cultureevents.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.singularity.cultureevents.model.Event;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCityAndDateAfterOrderByDateAsc(String city, LocalDateTime date);
//    List<Event> findByCityAndCategoryAndDateAfter(
//            String city, String category, LocalDateTime date);
//    List<Event> findByCategoryAndDateAfter(String category, LocalDateTime date);
//    List<Event> findByCityAndMoodAndDateAfter(
//            String city, String mood, LocalDateTime date);
//    List<Event> findByCity(String city);
//    List<Event> findByDateAfter(LocalDateTime date);

}
