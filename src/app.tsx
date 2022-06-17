import { format } from "date-fns";
import { Time } from "./components/Time";
import { useWeather } from "./hooks/useWeather";
import { weatherIconMapping } from "./components/utils";
import { WeatherIconComponents } from "./icons";

// Framed size: 1080 x 1920

export function App() {
  const { location, forecasts } = useWeather();
  console.log(forecasts);

  return (
    <>
      <div className="info">
        <div className="forecast">
          {forecasts &&
            forecasts.map((forecast, index) => {
              if (index % 2 === 0) {
                return null;
              }

              const { id, description } = forecast.weather[0];
              const iconId = `Night${weatherIconMapping[id]}`;
              return (
                <div className="weather" key={index}>
                  {WeatherIconComponents[iconId]}
                  <span>{description}</span>
                  <span>{format(new Date(forecast.dt * 1000), "p")}</span>
                </div>
              );
            })}
        </div>
        <div>
          <p className="location">{location}</p>
          <Time />
        </div>
      </div>
    </>
  );
}
