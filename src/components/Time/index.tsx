import { Fragment } from "preact";
import { format } from "date-fns";
import { useCurrentDate } from "../../hooks/useCurrentDate";

export const Time = () => {
  const date = useCurrentDate(1000);

  return (
    <Fragment>
      <p className="location date">{format(date, "MM/dd - EEEE")}</p>
      <div className="time">
        <p>{date.toLocaleTimeString()}</p>
      </div>
    </Fragment>
  );
};
