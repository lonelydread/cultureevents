package ru.singularity.cultureevents.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StringArrayConverter implements AttributeConverter<String[], String> {

    private final static String DELIMITER = ",";

    @Override
    public String convertToDatabaseColumn(String[] attribute) {
        if (attribute == null || attribute.length == 0) {
            return null;
        }
        // Преобразуем массив в строку: {"active", "cultural"} -> "active,cultural"
        return String.join(DELIMITER, attribute);
    }

    @Override
    public String[] convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new String[0];
        }
        // Преобразуем строку в массив: "active,cultural" -> {"active", "cultural"}
        String data = dbData.replace("{", "").replace("}", "");
        if (data.isEmpty()) {
            return new String[0];
        }
        return data.split(DELIMITER);
    }
}
