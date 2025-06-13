import { deleteTask, updateTask } from "@/db/methods";
import styles from "./task.module.css";

export default function Task({
  el,
  editTask,
  setEditTask,
  refProps,
  idx,
  tasks,
  setTasks,
  allTasks,
  setAllTasks,
}) {
  const changeTask = (e) => {
    const newTasks = [...tasks];
    newTasks[idx].name = e.target.value;
    setTasks(newTasks);
  };
  const setEdit = () => {
    if (editTask === null) {
      setEditTask(idx);
    }
  };

  const remove = () => {
    console.log("remove");
    deleteTask(el.id);
    const newList = tasks.filter((_, i) => i !== idx);
    setTasks(newList);
    const taskObj = { ...allTasks };
    delete taskObj[el.id];
    setAllTasks(taskObj);
  };
  const onCheck = (e) => {
    const checked = e.target.checked ? 1 : 0;
    updateTask(el.name, checked, el.id);
    const taskObj = { ...allTasks };
    taskObj[el.id].checked = checked;
    setAllTasks(taskObj);
  };
  return (
    <div
      {...refProps}
      key={el.id}
      className={styles.task}
      onDoubleClick={setEdit}
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
      {!(editTask === idx) && <div className={styles.label}>{el.name}</div>}
      {editTask === idx && (
        <input
          type="text"
          className={styles.taskInput}
          value={tasks[idx].name}
          onChange={changeTask}
        ></input>
      )}
      <div className={styles.delete} onClick={remove}>
        x
      </div>
    </div>
  );
}
