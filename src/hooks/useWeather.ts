import { useState, useEffect, useCallback } from "preact/hooks";
import { subHours, isBefore } from "date-fns";
import { IPAPI } from "../types/ipApi";
import { Weather, WeatherForecast } from "../types/weather";
import { LOCAL_STORAGE_KEY, getOpenWeatherAPI } from "../const";

// ms * sec * min * hour
const CACHE_INTERVAL_TIME = 1000 * 60 * 60 * 3;
const FORECAST_REFRESH_INTERVAL = 1000 * 60 * 60 * 1;

// https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2

export const useWeather = () => {
  const [location, setLocation] = useState<string>();
  const [forecasts, setForecasts] = useState<WeatherForecast[]>();
  const [filteredData, setFilteredData] = useState<WeatherForecast[]>();

  const init = async () => {
    try {
      const lastIntervalTime = subHours(new Date(), 3);
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

  const refreshFilter = () => {
    const currentDate = new Date();
    const result = forecasts?.filter((forecast) =>
      isBefore(currentDate, new Date(forecast.dt * 1000))
    );
    setFilteredData(result?.splice(0, 4));
  };

  useEffect(() => {
    refreshFilter();

    return () => setFilteredData(undefined);
  }, [forecasts]);

  useEffect(() => {
    init();
    const interval = setInterval(() => {
      init();
    }, CACHE_INTERVAL_TIME);

    const refresh = setInterval(() => {
      refreshFilter();
    }, FORECAST_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
      clearInterval(refresh);
    };
  }, []);

  return { location, filteredData };
};
