import { useEffect, useState } from 'preact/hooks';


export function App() {
  const [location, setLocation] = useState<string>();
  const [resolution, setResolution] = useState<Record<string, number>>();

  useEffect(() => {
    const init = async () => {
      try {
        const getCountry = await fetch('https://ipapi.co/json/');
        const response = await getCountry.json();
        console.log(response);
        setLocation(`${response.country}/${response.city}`);
      } catch (err) {
        if (err instanceof Error) {
          console.log('Error', err.message);
        }

        console.log('All error info', err);
      }
    };

    const deviceResolution = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    setResolution(deviceResolution);

    init();
  }, []);

  return (
    <div>
      <p>Current Location: {location}</p>
      <p>Browser size</p>
      <p>{resolution?.width}</p>
      <p>{resolution?.height}</p>
    </div>
  )
}
