import { useEffect, useRef, useState } from "react";
import styles from "./category.module.css";
import Task from "../task/task";
import { createTask, deleteTask, updateTask } from "@/db/methods";
import { useDroppable } from "@dnd-kit/core";
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
}) {
  const [categoryTasks, setCategoryTasks] = useState([]);

  useEffect(() => {
    console.log("trigger");
    const taskVals = Object.values(allTasks);
    const filtered = taskVals.filter((el) => {
      console.log(el, categories[idx]);
      const elDate = new Date(el.day);
      return (
        el.category === categories[idx].title &&
        elDate.toDateString() === date.toDateString()
      );
    });
    setCategoryTasks(filtered);
  }, [allTasks, categories, idx, date]);

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
    console.log("add");
    e.stopPropagation();
    console.log(editTask);
    if (editTask === null) {
      console.log("in add");
      setEditTask(0);
      const newTask = await createTask(date, " ", categories[idx].title);
      const taskObj = { ...allTasks };
      taskObj[newTask.id] = newTask;
      setAllTasks(taskObj);
    }
  };
  const remove = () => {
    categoryTasks.forEach((element) => {
      deleteTask(element.id);
      const taskObj = { ...allTasks };
      delete taskObj[element.id];
      setAllTasks(taskObj);
    });
    const newList = categories.filter((_, i) => i !== idx);
    setCategories(newList);
  };

  const bodyClass = end ? `${styles.body} ${styles.end}` : styles.body;
  const taskRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      console.log("outside click", taskRef.current);
      if (taskRef.current && !taskRef.current.contains(e.target)) {
        console.log("inside");
        if (editTask != null) {
          const task = categoryTasks[editTask];
          console.log("day", task.day);
          updateTask(task.name, task.checked, task.id, task.category, task.day);
        }
        setEditTask(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [categoryTasks]);
  const { setNodeRef, isOver } = useDroppable({
    id: idx,
    data: {
      category: categories[idx].title,
      date: date,
    },
  });

  const className = isOver
    ? `${styles.over} ${styles.taskContainer}`
    : styles.taskContainer;

  if (categories[idx].isNew) {
    return (
      <div className={bodyClass}>
        <div className={styles.titleContainer}>
          <input
            className={styles.titleInput}
            onChange={handleTitleChange}
          ></input>
          <div className={styles.delete} onClick={(e) => remove(e)}>
            —
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
          —
        </div>
      </div>
      <div className={className} ref={setNodeRef}>
        <button className={styles.add} onClick={(e) => onAdd(e)}>
          <div className={styles.line}></div>
          <div className={styles.plus}>+</div>
          <div className={styles.line}></div>
        </button>
        {categoryTasks.map((el, idx) => {
          let refProps = editTask === idx ? { ref: taskRef } : false;
          return (
            <Task
              el={el}
              refProps={refProps}
              editTask={editTask}
              setEditTask={setEditTask}
              idx={idx}
              tasks={categoryTasks}
              allTasks={allTasks}
              setAllTasks={setAllTasks}
            />
          );
        })}
      </div>
    </div>
  );
}
