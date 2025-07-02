import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./display.module.css";
import Task from "../task/task";
import { useDroppable } from "@dnd-kit/core";
import { createTask, deleteTask, updateTask } from "@/db/methods";

interface selectionData {
  date: string;
  title: string;
}

interface displayProps {
  title: string;
  conditionCheck: (el: any) => boolean;
  allTasks: any;
  setAllTasks: any;
  removeSelf: any;
  end: boolean;
  selectionData: selectionData;
}

export default function Display({
  title,
  conditionCheck,
  allTasks,
  setAllTasks,
  removeSelf,
  end,
  selectionData,
}: displayProps) {
  const [editTask, setEditTask] = useState<number | null>(null);

  const displayComponents = useMemo(() => {
    return Object.values(allTasks).filter((el) => conditionCheck(el));
  }, [allTasks, conditionCheck]);

  const handleAddTask = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("in add");
      const newTask = await createTask(
        selectionData.date,
        " ",
        selectionData.title
      );
      setEditTask(newTask.id);
      setAllTasks({
        ...allTasks,
        [newTask.id]: newTask,
      });
    },
    [editTask, selectionData, allTasks, setAllTasks]
  );

  const taskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (taskRef.current && !taskRef.current.contains(e.target as Node)) {
        if (editTask !== null) {
          const task = displayComponents[editTask];
          if (task) {
            updateTask(
              task.name,
              task.checked,
              task.id,
              task.category,
              task.day
            );
          }
        }
        setEditTask(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [displayComponents, editTask]);

  const { setNodeRef, isOver } = useDroppable({
    id: `${selectionData.date}-${selectionData.title}`,
    data: {
      date: selectionData.date,
      category: selectionData.title,
    },
  });

  useEffect(() => {
    console.log("Over", isOver);
  }, [isOver]);
  const className = isOver
    ? `${styles.over} ${styles.componentContainer}`
    : styles.componentContainer;
  const bodyClass = end ? `${styles.body} ${styles.end}` : styles.body;
  const removeAllTasks = () => {
    displayComponents.map((el) => {
      deleteTask(el.id);
    });
    setAllTasks(Object.values(allTasks).filter((el) => !conditionCheck(el)));
  };
  const remove = (e) => {
    removeAllTasks();
    removeSelf(e);
  };
  return (
    <div className={bodyClass}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.delete} onClick={(e) => remove(e)}>
          —
        </div>
      </div>
      <div className={className} ref={setNodeRef}>
        <button className={styles.add} onClick={handleAddTask}>
          <div className={styles.line}></div>
          <div className={styles.plus}>+</div>
          <div className={styles.line}></div>
        </button>
        {displayComponents.map((el, idx) => {
          const refProps = editTask === el.id ? { ref: taskRef } : {};
          return (
            <Task
              key={el.id || idx}
              el={el}
              editTask={editTask}
              setEditTask={setEditTask}
              refProps={refProps}
              idx={idx}
              tasks={displayComponents}
              allTasks={allTasks}
              setAllTasks={setAllTasks}
            />
          );
        })}
      </div>
    </div>
  );
}
