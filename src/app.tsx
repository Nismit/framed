import { h } from "preact";
import { Suspense } from "preact/compat";
import { format, startOfDay, add, isWithinInterval } from "date-fns";
import { Time } from "./components/Time";
import { Canvas } from "./components/Canvas";
import { useWeather } from "./hooks/useWeather";
import { weatherIconMapping } from "./components/utils";
import { WeatherIconComponents } from "./icons";

// Framed size: 1080 x 1920

export function App() {
  const { filteredData } = useWeather();

  return (
    <>
      <Canvas />
      <div className="info">
        <div className="forecast">
          {filteredData &&
            filteredData.map((forecast) => {
              const forecastDate = new Date(forecast.dt * 1000);
              const { id } = forecast.weather[0];
              const startOfDayTime = startOfDay(forecastDate);
              const morning = add(startOfDayTime, {
                hours: 7,
              });
              const evening = add(startOfDayTime, {
                hours: 18,
              });
              const isDayTime = isWithinInterval(forecastDate, {
                start: morning,
                end: evening,
              });
              const iconId = `${isDayTime ? "Day" : "Night"}${
                weatherIconMapping[id]
              }`;

              const Comp = WeatherIconComponents[iconId];

              return (
                <Suspense
                  fallback={
                    <div className="loader__container">
                      <span className="loader" />
                    </div>
                  }
                >
                  <div className="weather">
                    <Comp />
                    <span>
                      {Math.ceil(forecast.main.temp_min)}℃/
                      {Math.ceil(forecast.main.temp_max)}℃
                    </span>
                    <span>{format(new Date(forecast.dt * 1000), "p")}</span>
                  </div>
                </Suspense>
              );
            })}
        </div>

        <div>
          <Time />
        </div>
      </div>
    </>
  );
}
