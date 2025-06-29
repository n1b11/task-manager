"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { fetchTasks, updateTask } from "@/db/methods";
import { DndContext } from "@dnd-kit/core";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import WeekView from "./components/weeks-view/week-view";

export default function Home() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const [allTasks, setAllTasks] = useState({});

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
      <WeekView setAllTasks={setAllTasks} allTasks={allTasks} />
    </DndContext>
  );
}
