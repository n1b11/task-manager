import Day from "../day/day";
import styles from "./week.module.css";

export default function Week({
  setActiveWeek,
  startDate,
  allTasks,
  setAllTasks,
}) {
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const days = dayNames.map((dayName, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return { day: dayName, date };
  });

  return (
    <div className={styles.body}>
      <h2 className={styles.back} onClick={() => setActiveWeek(null)}>
        {"<"}
      </h2>
      <div className={styles.dayContainer}>
        {days.map((el, idx) => {
          return (
            <Day
              allTasks={allTasks}
              setAllTasks={setAllTasks}
              title={el.day}
              date={el.date}
            />
          );
        })}
      </div>
    </div>
  );
}
