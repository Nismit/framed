export const LOCAL_STORAGE_KEY = {
  LAST_SAVE: 'lastSave',
  LOCATION: 'location',
  WEATHER: 'weather',
};

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?';

export const getOpenWeatherAPI = (lat: number, lon: number) => {
  return `${API_BASE_URL}&cnt=8&units=metric&lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
};
