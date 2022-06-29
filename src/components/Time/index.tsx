import { useCurrentDate } from "../../hooks/useCurrentDate";

export const Time = () => {
  const date = useCurrentDate(1000);

  return (
    <div className="time">
      <p>{date.toLocaleTimeString()}</p>
    </div>
  );
};
