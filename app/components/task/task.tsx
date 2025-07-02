import { deleteTask, updateTask } from "@/db/methods";
import styles from "./task.module.css";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useCallback } from "react";

export default function Task({
  el,
  editTask,
  setEditTask,
  refProps,
  idx,
  tasks,
  allTasks,
  setAllTasks,
}) {
  const changeTask = (e) => {
    const newTasks = { ...allTasks };
    newTasks[el.id].name = e.target.value;
    setAllTasks(newTasks);
  };
  const setEdit = () => {
    if (editTask === null) {
      setEditTask(el.id);
    }
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: el.id,
      data: {
        homeTasks: tasks,
      },
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    });

  //This might not be correct
  const setCombinedRef = useCallback(
    (node) => {
      if (refProps && refProps.ref) {
        refProps.ref.current = node;
      }
      setNodeRef(node);
    },
    [refProps, setNodeRef]
  );

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  const remove = (editTask) => {
    deleteTask(el.id);
    const newList = tasks.filter((l) => l.id !== el.id);
    const taskObj = { ...allTasks };
    delete taskObj[el.id];
    setAllTasks(taskObj);
  };
  const onCheck = (e) => {
    const checked = e.target.checked ? 1 : 0;
    updateTask(el.name, checked, el.id, el.category, el.day);
    const taskObj = { ...allTasks };
    taskObj[el.id].checked = checked;
    setAllTasks(taskObj);
  };
  const className = isDragging
    ? `${styles.dragging} ${styles.task}`
    : styles.task;
  return (
    <div
      ref={setCombinedRef}
      key={el.id}
      className={className}
      onDoubleClick={setEdit}
      style={style}
      {...listeners}
      {...attributes}
    >
      <input
        className={styles.checkbox}
        type="checkbox"
        id={el.name + idx}
        name={el.name + idx}
        onClick={(e) => e.stopPropagation()}
        onChange={onCheck}
        defaultChecked={el.checked === 1}
      />
      {!(editTask === el.id) && <div className={styles.label}>{el.name}</div>}
      {editTask === el.id && (
        <input
          type="text"
          className={styles.taskInput}
          value={tasks[idx].name}
          onChange={changeTask}
        ></input>
      )}
      <div className={styles.delete} onClick={(e) => remove(e)}>
        —
      </div>
    </div>
  );
}
