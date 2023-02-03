import { format } from "date-fns";
import { useCurrentDate } from "../../hooks/useCurrentDate";

export const Time = () => {
  const date = useCurrentDate(1000);

  return (
    <>
      <p className="location date">{format(date, "MM/dd - EEEE")}</p>
      <div className="time">
        <p>{date.toLocaleTimeString()}</p>
      </div>
    </>
  );
};
