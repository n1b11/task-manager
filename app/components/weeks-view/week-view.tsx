import { useState } from "react";
import styles from "./week.module.css";
import WeekCard from "../week-card/week";
import Week from "../week/week";
import WeekV2 from "../week/weekv2";

interface weekViewProps {
  setAllTasks: (any) => void;
  allTasks: any;
}
export default function WeekView({ allTasks, setAllTasks }: weekViewProps) {
  const createWeeks = () => {
    const startDate = new Date("2025-06-08");
    const endDate = new Date();
    const weeks = [];

    while (startDate <= endDate) {
      const start = new Date(startDate);

      startDate.setDate(startDate.getDate() + 7);
      const end = new Date(startDate);

      weeks.unshift([
        {
          date: start,
          year: String(start.getFullYear()),
          month: String(start.getMonth() + 1).padStart(2, "0"),
          day: String(start.getDate()).padStart(2, "0"),
        },
        {
          year: String(end.getFullYear()),
          month: String(end.getMonth() + 1).padStart(2, "0"),
          day: String(end.getDate()).padStart(2, "0"),
        },
      ]);
    }

    return weeks;
  };

  const currentWeeks = createWeeks();
  const [weeks, setWeeks] = useState(currentWeeks);
  const [activeWeek, setActiveWeek] = useState(null);
  const getTitle = (el) => {
    return (
      el[0].month +
      "/" +
      el[0].day +
      "/" +
      el[0].year +
      " - " +
      el[1].month +
      "/" +
      el[1].day +
      "/" +
      el[1].year
    );
  };
  return (
    <div className={styles.page}>
      {activeWeek == null &&
        weeks.map((el, idx) => {
          return (
            <WeekCard
              title={getTitle(el)}
              onClick={() => {
                setActiveWeek(idx);
              }}
            />
          );
        })}
      {activeWeek != null && (
        <WeekV2
          setActiveWeek={setActiveWeek}
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          startDate={weeks[activeWeek][0].date}
        />
      )}
    </div>
  );
}
