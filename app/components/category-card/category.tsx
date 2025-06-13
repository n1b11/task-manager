import { useEffect, useRef, useState } from "react";
import styles from "./category.module.css";
import Task from "../task/task";
import { createTask, deleteTask, updateTask } from "@/db/methods";
export default function Category({
  title,
  end,
  isNew,
  categories,
  setCategories,
  idx,
  date,
  allTasks,
  setAllTasks,
  selectedTasks,
}) {
  const categoryTasks = selectedTasks.filter((el) => {
    return el.category === categories[idx].title;
  });
  console.log("cat", categoryTasks);
  const [tasks, setTasks] = useState(categoryTasks);
  const [isWeekChecked, setIsWeekChecked] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const handleWeekCheckboxChange = () => {
    setIsWeekChecked(!isWeekChecked);
  };

  const handleAllCheckboxChange = () => {
    setIsAllChecked(!isAllChecked);
  };

  const handleTitleChange = (e) => {
    const newList = [...categories];
    newList[idx] = { title: e.target.value, isNew: newList[idx].isNew };
    setCategories(newList);
  };

  const onCreate = () => {
    console.log("create");

    const newList = [...categories];
    newList[idx] = { title: newList[idx].title, isNew: false };
    setCategories(newList);
  };

  const onAdd = async (e) => {
    console.log("Category component: date prop for createTask:", date);
    e.stopPropagation();
    if (editTask === null) {
      setEditTask(0);
      const newTask = await createTask(date, " ", categories[idx].title);
      console.log(newTask);
      const taskObj = { ...allTasks };
      taskObj[newTask.id] = newTask;
      setTasks([newTask, ...tasks]);
      setAllTasks(taskObj);
    }
  };
  const remove = () => {
    tasks.forEach((element) => {
      deleteTask(element.id);
    });
    const newList = categories.filter((_, i) => i !== idx);
    setCategories(newList);
  };

  const bodyClass = end ? `${styles.body} ${styles.end}` : styles.body;
  const taskRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (taskRef.current && !taskRef.current.contains(e.target)) {
        if (editTask != null) {
          const task = tasks[editTask];
          updateTask(task.name, task.checked, task.id);
        }
        setEditTask(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [tasks]);

  if (categories[idx].isNew) {
    return (
      <div className={bodyClass}>
        <div className={styles.titleContainer}>
          <input
            className={styles.titleInput}
            onChange={handleTitleChange}
          ></input>
          <div className={styles.delete} onClick={remove}>
            x
          </div>
        </div>
        <div className={styles.taskContainer}>
          <div className={styles.inputLine}>
            <input
              type="checkbox"
              id="weekCheck"
              checked={isWeekChecked}
              onChange={handleWeekCheckboxChange}
              className={styles.createCheck}
            />
            <label htmlFor="weekCheck">Add to Future Days</label>
          </div>
          <div className={styles.inputLine}>
            <input
              className={styles.createCheck}
              type="checkbox"
              id="allCheck"
              checked={isAllChecked}
              onChange={handleAllCheckboxChange}
            />
            <label htmlFor="allCheck">Add to Future Weeks</label>
          </div>
          <div className={styles.createContainer}>
            <button className={styles.create} onClick={onCreate}>
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={bodyClass}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.delete} onClick={remove}>
          x
        </div>
      </div>
      <div className={styles.taskContainer}>
        <button className={styles.add} onClick={(e) => onAdd(e)}>
          <div className={styles.line}></div>
          <div className={styles.plus}>+</div>
          <div className={styles.line}></div>
        </button>
        {tasks.map((el, idx) => {
          const refProps = editTask === idx ? { ref: taskRef } : {};
          return (
            <Task
              el={el}
              refProps={refProps}
              editTask={editTask}
              setEditTask={setEditTask}
              idx={idx}
              tasks={tasks}
              setTasks={setTasks}
              allTasks={allTasks}
              setAllTasks={setAllTasks}
            />
          );
        })}
      </div>
    </div>
  );
}
