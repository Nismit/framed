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
  const { location, forecasts } = useWeather();

  return (
    <>
      <Canvas />
      <div className="info">
        <div className="forecast">
          {forecasts &&
            forecasts.map((forecast, index) => {
              if (index > 3) {
                return null;
              }

              const { id } = forecast.weather[0];
              const evening = add(startOfDay(new Date(forecast.dt * 1000)), {
                hours: 18,
              });
              const isNight = isAfter(new Date(forecast.dt * 1000), evening);
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
          <p className="location">{location}</p>
          <Time />
        </div>
      </div>
    </>
  );
}
