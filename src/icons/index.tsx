import { FunctionComponent } from "preact";
import { lazy } from "preact/compat";

export const WeatherIconComponents: Record<string, FunctionComponent> = {
  DayClear: lazy<FunctionComponent>(() =>
    import("./DayClear").then((c) => {
      return { default: c.DayClear };
    })
  ),
  DayCloudyGusts: lazy<FunctionComponent>(() =>
    import("./DayCloudyGusts").then((c) => {
      return { default: c.DayCloudyGusts };
    })
  ),
  DayDust: lazy<FunctionComponent>(() =>
    import("./DayDust").then((c) => {
      return { default: c.DayDust };
    })
  ),
  DayFog: lazy<FunctionComponent>(() =>
    import("./DayFog").then((c) => {
      return { default: c.DayFog };
    })
  ),
  DayHaze: lazy<FunctionComponent>(() =>
    import("./DayHaze").then((c) => {
      return { default: c.DayHaze };
    })
  ),
  DayLightning: lazy<FunctionComponent>(() =>
    import("./DayLightning").then((c) => {
      return { default: c.DayLightning };
    })
  ),
  DayRain: lazy<FunctionComponent>(() =>
    import("./DayRain").then((c) => {
      return { default: c.DayRain };
    })
  ),
  DayRainMix: lazy<FunctionComponent>(() =>
    import("./DayRainMix").then((c) => {
      return { default: c.DayRainMix };
    })
  ),
  DayRainWind: lazy<FunctionComponent>(() =>
    import("./DayRainWind").then((c) => {
      return { default: c.DayRainWind };
    })
  ),
  DayShowers: lazy<FunctionComponent>(() =>
    import("./DayShowers").then((c) => {
      return { default: c.DayShowers };
    })
  ),
  DaySleet: lazy<FunctionComponent>(() =>
    import("./DaySleet").then((c) => {
      return { default: c.DaySleet };
    })
  ),
  DaySmog: lazy<FunctionComponent>(() =>
    import("./DaySmog").then((c) => {
      return { default: c.DaySmog };
    })
  ),
  DaySnow: lazy<FunctionComponent>(() =>
    import("./DaySnow").then((c) => {
      return { default: c.DaySnow };
    })
  ),
  DaySprinkle: lazy<FunctionComponent>(() =>
    import("./DaySprinkle").then((c) => {
      return { default: c.DaySprinkle };
    })
  ),
  DayStormShowers: lazy<FunctionComponent>(() =>
    import("./DayStormShowers").then((c) => {
      return { default: c.DayStormShowers };
    })
  ),
  DaySunnyOvercast: lazy<FunctionComponent>(() =>
    import("./DaySunnyOvercast").then((c) => {
      return { default: c.DaySunnyOvercast };
    })
  ),
  DayThunderstorm: lazy<FunctionComponent>(() =>
    import("./DayThunderstorm").then((c) => {
      return { default: c.DayThunderstorm };
    })
  ),
  NightClear: lazy<FunctionComponent>(() =>
    import("./NightClear").then((c) => {
      return { default: c.NightClear };
    })
  ),
  NightCloudyGusts: lazy<FunctionComponent>(() =>
    import("./NightCloudyGusts").then((c) => {
      return { default: c.NightCloudyGusts };
    })
  ),
  NightDust: lazy<FunctionComponent>(() =>
    import("./NightDust").then((c) => {
      return { default: c.NightDust };
    })
  ),
  NightFog: lazy<FunctionComponent>(() =>
    import("./NightFog").then((c) => {
      return { default: c.NightFog };
    })
  ),
  NightHaze: lazy<FunctionComponent>(() =>
    import("./NightHaze").then((c) => {
      return { default: c.NightHaze };
    })
  ),
  NightLightning: lazy<FunctionComponent>(() =>
    import("./NightLightning").then((c) => {
      return { default: c.NightLightning };
    })
  ),
  NightRain: lazy<FunctionComponent>(() =>
    import("./NightRain").then((c) => {
      return { default: c.NightRain };
    })
  ),
  NightRainMix: lazy<FunctionComponent>(() =>
    import("./NightRainMix").then((c) => {
      return { default: c.NightRainMix };
    })
  ),
  NightRainWind: lazy<FunctionComponent>(() =>
    import("./NightRainWind").then((c) => {
      return { default: c.NightRainWind };
    })
  ),
  NightShowers: lazy<FunctionComponent>(() =>
    import("./NightShowers").then((c) => {
      return { default: c.NightShowers };
    })
  ),
  NightSleet: lazy<FunctionComponent>(() =>
    import("./NightSleet").then((c) => {
      return { default: c.NightSleet };
    })
  ),
  NightSmog: lazy<FunctionComponent>(() =>
    import("./NightSmog").then((c) => {
      return { default: c.NightSmog };
    })
  ),
  NightSnow: lazy<FunctionComponent>(() =>
    import("./NightSnow").then((c) => {
      return { default: c.NightSnow };
    })
  ),
  NightSprinkle: lazy<FunctionComponent>(() =>
    import("./NightSprinkle").then((c) => {
      return { default: c.NightSprinkle };
    })
  ),
  NightStormShowers: lazy<FunctionComponent>(() =>
    import("./NightStormShowers").then((c) => {
      return { default: c.NightStormShowers };
    })
  ),
  NightSunnyOvercast: lazy<FunctionComponent>(() =>
    import("./NightSunnyOvercast").then((c) => {
      return { default: c.NightSunnyOvercast };
    })
  ),
  NightThunderstorm: lazy<FunctionComponent>(() =>
    import("./NightThunderstorm").then((c) => {
      return { default: c.NightThunderstorm };
    })
  ),
};
