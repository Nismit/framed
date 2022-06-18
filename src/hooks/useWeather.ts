import { useState, useEffect } from "preact/hooks";
import { subHours } from "date-fns";
import { IPAPI } from "../types/ipApi";
import { Weather, WeatherForecast } from "../types/weather";
import { LOCAL_STORAGE_KEY, getOpenWeatherAPI } from "../const";

// ms * sec * min * hour
const INTERVAL_TIME = 1000 * 60 * 60 * 3;

// https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2

export const useWeather = () => {
  const [location, setLocation] = useState<string>();
  const [forecasts, setForecasts] = useState<WeatherForecast[]>();

  const init = async () => {
    try {
      const lastIntervalTime = subHours(new Date(), 6);
      const lastIntervalTimeDate = new Date(lastIntervalTime);
      const cacheLastSave = localStorage.getItem(LOCAL_STORAGE_KEY.LAST_SAVE);
      const cacheLocation = localStorage.getItem(LOCAL_STORAGE_KEY.LOCATION);
      const cacheWeather = localStorage.getItem(LOCAL_STORAGE_KEY.WEATHER);

      // For Debug
      // console.log("6 hours", lastIntervalTimeDate);

      if (
        !cacheLastSave ||
        !cacheLocation ||
        !cacheWeather ||
        new Date(cacheLastSave) < lastIntervalTimeDate
      ) {
        console.log("Cache expire or does not exist");
        const getLocationByIp = await fetch("https://ipapi.co/json/");
        const locationRes: IPAPI = await getLocationByIp.json();
        const getWeather = await fetch(
          getOpenWeatherAPI(locationRes.latitude, locationRes.longitude)
        );
        const weatherRes: Weather = await getWeather.json();

        localStorage.setItem(
          LOCAL_STORAGE_KEY.LOCATION,
          JSON.stringify(locationRes)
        );
        localStorage.setItem(
          LOCAL_STORAGE_KEY.WEATHER,
          JSON.stringify(weatherRes)
        );
        localStorage.setItem(
          LOCAL_STORAGE_KEY.LAST_SAVE,
          new Date().toISOString()
        );

        setLocation(`${locationRes.city} - ${locationRes.country_name}`);
        setForecasts(weatherRes.list);
      } else {
        const location: IPAPI = JSON.parse(cacheLocation);
        setLocation(`${location.city} - ${location.country_name}`);
        const weather: Weather = JSON.parse(cacheWeather);
        setForecasts(weather.list);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error", err.message);
      }
    }
  };

  useEffect(() => {
    init();
    const interval = setInterval(() => {
      init();
    }, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, []);

  return { location, forecasts };
};
