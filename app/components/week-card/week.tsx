import styles from "./week.module.css";
export default function WeekCard({ title, onClick }) {
  return (
    <div onClick={onClick} className={styles.body}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.line}></div>
    </div>
  );
}
