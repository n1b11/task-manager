"use client";
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
    const taskId = active.id;
    console.log("OVER", over);

    if (over) {
      const { category, date } = over.data.current;

      try {
        const updatedTask = await updateTask(
          allTasks[taskId].name,
          allTasks[taskId].checked,
          taskId,
          category,
          date
        );
        if (updatedTask) {
          setAllTasks((prevTasks) => ({
            ...prevTasks,
            [taskId]: updatedTask,
          }));
        }
      } catch (error) {
        console.error("Error updating task:", error);
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
      // console.log("Fetched tasks on load:", tasks);
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
