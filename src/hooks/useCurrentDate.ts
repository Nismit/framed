import { useState, useEffect } from "preact/hooks";

export const useCurrentDate = (interval: number) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, interval);
  }, [setDate]);

  return date;
};
