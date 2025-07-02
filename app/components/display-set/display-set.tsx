import { useState } from "react";
import Display from "../display/display";
import styles from "./set.module.css";
import NewDisplay from "../new-display/new-display";
interface Section {
  conditionCheck: { (el: any): boolean }[];
  title: string;
  date: string;
}
interface displaySetProps {
  title: string;
  allTasks: any[];
  setAllTasks: (el: any) => void;
  sectionArray: Section[];
  newConditionCheck: (el, newCategory: any) => boolean;
  classification: any;
}
export default function DisplaySet({
  title,
  allTasks,
  setAllTasks,
  sectionArray,
  newConditionCheck,
  classification,
}: displaySetProps) {
  const [creatingNew, setCreatingNew] = useState(false);
  const [sections, setSections] = useState<Section[]>(sectionArray);
  const remove = () => null;

  const onAdd = (e) => {
    setCreatingNew(true);
  };

  const create = (title: string) => {
    setSections([
      ...sections,
      {
        conditionCheck: (el) => newConditionCheck(el, title),
        title: title,
        date: classification.date,
      },
    ]);
    setCreatingNew(false);
  };
  const removeCategory = (idx) => {
    const newSections = [...sections];
    newSections.splice(idx, 1);
    setSections(newSections);
  };
  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.displayArea}>
        {sections.map((el, idx) => {
          return (
            <Display
              title={el.title}
              conditionCheck={el.conditionCheck}
              allTasks={allTasks}
              setAllTasks={setAllTasks}
              removeSelf={() => removeCategory(idx)}
              end={idx === sections.length - 1}
              selectionData={{ title: el.title, date: el.date }}
            />
          );
        })}
        {creatingNew && <NewDisplay remove={remove} create={create} />}
        <button className={styles.add} onClick={(e) => onAdd(e)}>
          <div className={styles.line}></div>
          <div className={styles.plus}>+</div>
          <div className={styles.line}></div>
        </button>
      </div>
    </div>
  );
}
