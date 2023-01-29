import { h } from "preact";
import { Suspense } from "preact/compat";
import { format, startOfDay, add, isAfter } from "date-fns";
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
              const evening = add(startOfDay(forecastDate), {
                hours: 18,
              });
              const isNight = isAfter(forecastDate, evening);
              const iconId = `${isNight ? "Night" : "Day"}${
                weatherIconMapping[id]
              }`;

              const Comp = WeatherIconComponents[iconId];

              return (
                <Suspense fallback={<div>loading...</div>}>
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
