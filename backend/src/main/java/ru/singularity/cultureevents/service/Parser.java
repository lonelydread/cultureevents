package ru.singularity.cultureevents.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.IOException;
import java.time.LocalTime;
import java.util.Timer;
import java.util.TimerTask;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import java.io.IOException;
import java.time.LocalTime;
import java.util.Timer;
import java.util.TimerTask;

public class Parser {
    // базовый адрес сайта
    private static final String BASE_URL = "https://pogoda.mail.ru/prognoz/";


    public static String parseWeather(String city) {
        String url = BASE_URL + city + "/24hours/";
        try {
            Document doc = Jsoup.connect(url).get();

            // выбираем элемент <span class="p-forecast__description">
            Element description = doc.selectFirst("span.p-forecast__description");

            if (description != null) {
                String weather = description.text();
                System.out.println("[" + LocalTime.now() + "] " +
                        "Погода в " + city + ": " + weather);
                return weather;
            } else {
                String error = "Не удалось найти описание погоды";
                System.out.println("[" + LocalTime.now() + "] " + error);
                return error;
            }

        } catch (IOException e) {
            String error = "Ошибка подключения: " + e.getMessage();
            System.out.println(error);
            return error;
        }
    }
}


