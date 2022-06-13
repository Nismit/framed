import { useState, useEffect } from "preact/hooks";
import { IPAPI } from "../types/ipApi";

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?';

const getOpenWeatherAPI = (lat: number, lon: number) => {
  return `${API_BASE_URL}lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
}

export const useWeather = () => {
  const [location, setLocation] = useState<string>();

  const init = async () => {
    try {
      const getCountry = await fetch('https://ipapi.co/json/');
      const response: IPAPI = await getCountry.json();
      // console.log(response);
      setLocation(`${response.city} - ${response.country_name}`);
      // const getWeather = await fetch(getOpenWeatherAPI(response.latitude, response.longitude));
      // const response2 = await getWeather.json();
      // console.log(response2);

    } catch (err) {
      if (err instanceof Error) {
        console.log('Error', err.message);
      }

      console.log('All error info', err);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return location;
};
