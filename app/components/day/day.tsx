import { useEffect, useState } from "react";
import styles from "./day.module.css";
import Category from "../category-card/category";

export default function Day({ title, allTasks, setAllTasks, date }) {
  const taskArray = Object.values(allTasks);
  const selectedTasks = taskArray.filter((el) => {
    const taskDate = new Date(el.day);
    return taskDate.toDateString() === date.toDateString();
  });

  const uniqueCategoryTitles = [
    ...new Set(selectedTasks.map((el) => el.category)),
  ];

  const allCategories = uniqueCategoryTitles.map((categoryTitle) => {
    return {
      title: categoryTitle,
      isNew: false,
    };
  });
  const [categories, setCategories] = useState(allCategories);
  const onClick = () => {
    setCategories([...categories, { title: "new category", isNew: true }]);
  };
  console.log(allTasks);
  console.log(Object.values(allTasks));
  return (
    <div className={styles.body}>
      <h1 className={styles.Title}>{title}</h1>
      <div className={styles.categoryContainer}>
        {categories.map((el, idx) => {
          return (
            <Category
              title={el.title}
              end={idx === categories.length - 1}
              isNew={el.isNew}
              idx={idx}
              setCategories={setCategories}
              categories={categories}
              date={date}
              allTasks={allTasks}
              setAllTasks={setAllTasks}
            />
          );
        })}
        <button className={styles.add} onClick={onClick}>
          <div className={styles.line}></div>
          <div className={styles.plus}>+</div>
          <div className={styles.line}></div>
        </button>
      </div>
    </div>
  );
}
