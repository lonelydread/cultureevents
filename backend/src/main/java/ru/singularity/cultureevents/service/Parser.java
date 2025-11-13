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
    // город — эту переменную можно менять
    private static String city = "sankt_peterburg";

    public static void main(String[] args) {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                parseWeather();
            }
        }, 0, 60 * 1000); // каждые 60 секунд
    }

    private static void parseWeather() {
        String url = BASE_URL + city + "/24hours/";
        try {
            Document doc = Jsoup.connect(url).get();

            // выбираем элемент <span class="p-forecast__description">
            Element description = doc.selectFirst("span.p-forecast__description");

            if (description != null) {
                String weather = description.text();
                System.out.println("[" + LocalTime.now() + "] " +
                        "Погода в " + city + ": " + weather);
            } else {
                System.out.println("[" + LocalTime.now() + "] " +
                        "Не удалось найти описание погоды на странице.");
            }

        } catch (IOException e) {
            System.out.println("Ошибка подключения: " + e.getMessage());
        }
    }
}


