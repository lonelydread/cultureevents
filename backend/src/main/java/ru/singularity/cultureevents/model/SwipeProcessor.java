package ru.singularity.cultureevents.model;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.io.File;
import com.fasterxml.jackson.databind.ObjectMapper;

// Обработка свайпов
public class SwipeProcessor {

    private static final double coeff = 0.3; // насколько сильно свайп влияет на предпочтения, чем выше коэфф, тем сильнее

    public static void main(String[] args) throws IOException {
        // предпочтения пользователя
        Map<String, Double> userPrefs = new HashMap<>();
        userPrefs.put("food", 0.5);
        userPrefs.put("outdoor", 0.5);
        userPrefs.put("active", 0.5);
        userPrefs.put("culture", 0.5);
        userPrefs.put("romantic", 0.5);

        // пример карточки
        Map<String, Integer> cardTags1 = new HashMap<>();
        cardTags1.put("outdoor", 1);
        cardTags1.put("active", 1);
        cardTags1.put("nature", 1);

        // свайп вправо - лайк
        updatePreferences(userPrefs, cardTags1, true);

        // вторая карточка
        Map<String, Integer> cardTags2 = new HashMap<>();
        cardTags2.put("culture", 1);
        cardTags2.put("indoor", 1);
        cardTags2.put("calm", 1);

        // свайп влево дизлайк
        updatePreferences(userPrefs, cardTags2, false);

        // сохр в JSON
        savePreferencesToJson(userPrefs, "user_prefs.json");
    }
    
    public static void updatePreferences(Map<String, Double> userPrefs,
                                         Map<String, Integer> cardTags,
                                         boolean liked) {
        for (String tag : cardTags.keySet()) {
            double value = userPrefs.getOrDefault(tag, 0.5);
            if (cardTags.get(tag) == 1) {
                if (liked) {
                    value += coeff * (1 - value);
                } else {
                    value -= coeff * value;
                }
                userPrefs.put(tag, Math.min(1.0, Math.max(0.0, value)));
            }
        }
    }

    public static void savePreferencesToJson(Map<String, Double> userPrefs, String fileName) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> output = new HashMap<>();
        output.put("user_id", 1);  // 1 это пример id пользователя
        output.put("preferences", userPrefs);

        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(fileName), output);
    }
}
