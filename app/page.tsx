"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import WeekCard from "./components/week-card/week";
import Week from "./components/week/week";
import { fetchTasks } from "@/db/methods";

export default function Home() {
  const createWeeks = () => {
    const startDate = new Date("2025-06-08");
    const endDate = new Date();
    const weeks = [];

    while (startDate <= endDate) {
      const start = {
        date: startDate,
        year: String(startDate.getFullYear()),
        month: String(startDate.getMonth() + 1).padStart(2, "0"),
        day: String(startDate.getDate()).padStart(2, "0"),
      };

      startDate.setDate(startDate.getDate() + 7);
      const end = {
        year: String(startDate.getFullYear()),
        month: String(startDate.getMonth() + 1).padStart(2, "0"),
        day: String(startDate.getDate()).padStart(2, "0"),
      };
      weeks.unshift([start, end]);
    }

    return weeks;
  };
  const [allTasks, setAllTasks] = useState({});
  const currentWeeks = createWeeks();
  const [weeks, setWeeks] = useState(currentWeeks);
  const [activeWeek, setActiveWeek] = useState(null);

  useEffect(() => {
    // Fetch tasks when the component mounts
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasks();
      console.log(fetchedTasks);
      const tasks = {};
      fetchedTasks.forEach((element) => {
        tasks[element.id] = element;
      });
      console.log(tasks);
      if (fetchedTasks) {
        console.log("here");
        setAllTasks(tasks);
      }
    };
    loadTasks();
  }, []);
  return (
    <div className={styles.page}>
      {activeWeek == null &&
        weeks.map((el, idx) => {
          return (
            <WeekCard
              title={
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
              }
              onClick={() => {
                setActiveWeek(idx);
              }}
            />
          );
        })}
      {activeWeek != null && (
        <Week
          setActiveWeek={setActiveWeek}
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          startDate={weeks[activeWeek][0].date}
        />
      )}
    </div>
  );
}
