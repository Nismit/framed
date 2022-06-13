import { Time } from './components/Time';
import { useWeather } from './hooks/useWeather';

// Framed size: 1080 x 1920

export function App() {
  const location =  useWeather();

  return (
    <>
      <div className='info'>
        <p className='location'>{location}</p>
        <Time />
      </div>
    </>
  );
};
