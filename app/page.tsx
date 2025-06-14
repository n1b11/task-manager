"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import WeekCard from "./components/week-card/week";
import Week from "./components/week/week";
import { fetchTasks, updateTask } from "@/db/methods";
import { DndContext } from "@dnd-kit/core";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

export default function Home() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
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

  const handleDragEnd = async ({ active, over }) => {
    console.log("drag end", active.id);
    const taskId = active.id;
    const { setHomeTasks, homeTasks } = active.data.current;
    console.log(over);
    if (over) {
      const { category, date } = over.data.current;
      console.log(category);
      console.log(allTasks[taskId]);
      const updatedTask = await updateTask(
        allTasks[taskId].name,
        allTasks[taskId].checked,
        taskId,
        category,
        date
      );
      console.log("updated task", updateTask);
      if (updateTask) {
        const newTasks = { ...allTasks };
        newTasks[taskId] = updatedTask;
        setAllTasks(newTasks);
        const updatedHomeTasks = homeTasks.filter((el) => {
          return el.id != taskId;
        });
      }
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasks();
      const tasks = {};
      fetchedTasks.forEach((element) => {
        tasks[element.id] = element;
      });
      console.log(tasks);
      if (fetchedTasks) {
        setAllTasks(tasks);
      }
    };
    loadTasks();
  }, []);
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
          <Week
            setActiveWeek={setActiveWeek}
            allTasks={allTasks}
            setAllTasks={setAllTasks}
            startDate={weeks[activeWeek][0].date}
          />
        )}
      </div>
    </DndContext>
  );
}
