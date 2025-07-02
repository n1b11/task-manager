import { useState } from "react";
import styles from "./new.module.css";
export default function NewDisplay({ remove, create }) {
  const [title, setTitle] = useState("");
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className={styles.body}>
      <div className={styles.titleContainer}>
        <input
          className={styles.titleInput}
          onChange={handleTitleChange}
          value={title}
        ></input>
        <div className={styles.delete} onClick={(e) => remove(e)}>
          —
        </div>
      </div>
      <div className={styles.taskContainer}>
        <div className={styles.createContainer}>
          <button className={styles.create} onClick={() => create(title)}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
