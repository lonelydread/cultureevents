package ru.singularity.cultureevents.repository;


import ru.singularity.cultureevents.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByCity(String city);
    List<Event> findByCategory(String category);
    List<Event> findByCityAndCategory(String city, String category);
    List<Event> findByMood(String mood);
}
