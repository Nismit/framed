import { Component } from "preact";
import { DayClear } from "./DayClear";
import { DayCloudyGusts } from "./DayCloudyGusts";
import { DayDust } from "./DayDust";
import { DayFog } from "./DayFog";
import { DayHaze } from "./DayHaze";
import { DayLightning } from "./DayLightning";
import { DayRain } from "./DayRain";
import { DayRainMix } from "./DayRainMix";
import { DayRainWind } from "./DayRainWind";
import { DayShowers } from "./DayShowers";
import { DaySleet } from "./DaySleet";
import { DaySmog } from "./DaySmog";
import { DaySnow } from "./DaySnow";
import { DaySprinkle } from "./DaySprinkle";
import { DayStormShowers } from "./DayStormShowers";
import { DaySunnyOvercast } from "./DaySunnyOvercast";
import { DayThunderstorm } from "./DayThunderstorm";
import { NightClear } from "./NightClear";
import { NightCloudyGusts } from "./NightCloudyGusts";
import { NightDust } from "./NightDust";
import { NightFog } from "./NightFog";
import { NightHaze } from "./NightHaze";
import { NightLightning } from "./NightLightning";
import { NightRain } from "./NightRain";
import { NightRainMix } from "./NightRainMix";
import { NightRainWind } from "./NightRainWind";
import { NightShowers } from "./NightShowers";
import { NightSleet } from "./NightSleet";
import { NightSmog } from "./NightSmog";
import { NightSnow } from "./NightSnow";
import { NightSprinkle } from "./NightSprinkle";
import { NightStormShowers } from "./NightStormShowers";
import { NightSunnyOvercast } from "./NightSunnyOvercast";
import { NightThunderstorm } from "./NightThunderstorm";

export const WeatherIconComponents: Record<string, any> = {
  DayClear: <DayClear />,
  DayCloudyGusts: <DayCloudyGusts />,
  DayDust: <DayDust />,
  DayFog: <DayFog />,
  DayHaze: <DayHaze />,
  DayLightning: <DayLightning />,
  DayRain: <DayRain />,
  DayRainMix: <DayRainMix />,
  DayRainWind: <DayRainWind />,
  DayShowers: <DayShowers />,
  DaySleet: <DaySleet />,
  DaySmog: <DaySmog />,
  DaySnow: <DaySnow />,
  DaySprinkle: <DaySprinkle />,
  DayStormShowers: <DayStormShowers />,
  DaySunnyOvercast: <DaySunnyOvercast />,
  DayThunderstorm: <DayThunderstorm />,
  NightClear: <NightClear />,
  NightCloudyGusts: <NightCloudyGusts />,
  NightDust: <NightDust />,
  NightFog: <NightFog />,
  NightHaze: <NightHaze />,
  NightLightning: <NightLightning />,
  NightRain: <NightRain />,
  NightRainMix: <NightRainMix />,
  NightRainWind: <NightRainWind />,
  NightShowers: <NightShowers />,
  NightSleet: <NightSleet />,
  NightSmog: <NightSmog />,
  NightSnow: <NightSnow />,
  NightSprinkle: <NightSprinkle />,
  NightStormShowers: <NightStormShowers />,
  NightSunnyOvercast: <NightSunnyOvercast />,
  NightThunderstorm: <NightThunderstorm />,
};
