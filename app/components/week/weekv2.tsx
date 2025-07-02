import { useEffect } from "react";
import Day from "../day/day";
import DisplaySet from "../display-set/display-set";
import styles from "./week.module.css";

export default function WeekV2({
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

  useEffect(() => {
    console.log("ALL-----", allTasks);
  }, []);
  const taskArray = Object.values(allTasks);
  return (
    <div className={styles.body}>
      <h2 className={styles.back} onClick={() => setActiveWeek(null)}>
        {"<"}
      </h2>
      <div className={styles.dayContainer}>
        {taskArray.length > 0 &&
          days.map((day, idx) => {
            const selectedTasks = taskArray.filter((el) => {
              console.log("EL", el);
              const elDate = new Date(el.day);
              return elDate.toDateString() === day.date.toDateString();
            });

            const uniqueCategories = [
              ...new Set(selectedTasks.map((el) => el.category)),
            ];

            const conditionCheck = (el, newCategory) => {
              const elDate = new Date(el.day);
              return (
                el.category === newCategory &&
                elDate.toDateString() === day.date.toDateString()
              );
            };
            const categoryArray = uniqueCategories.map((category) => {
              return {
                conditionCheck: (el) => conditionCheck(el, category),
                title: category,
                date: day.date.toDateString(),
              };
            });
            return (
              <DisplaySet
                title={day.day}
                allTasks={allTasks}
                setAllTasks={setAllTasks}
                sectionArray={categoryArray}
                newConditionCheck={conditionCheck}
                classification={{
                  date: day.date.toDateString(),
                  displayTitle: day.day,
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
