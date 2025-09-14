// components/EmptyState.js
import { Frown } from "lucide-react"; // or any icon library
import styles from "./empty.module.css";

export default function EmptyState({ title, message, actionText, actionHref }) {
  return (
    <div className={styles.emptyState}>
      <Frown className={styles.icon} />
      <h2>{title}</h2>
      <p>{message}</p>
      {actionText && actionHref && (
        <a href={actionHref} className={styles.button}>
          {actionText}
        </a>
      )}
    </div>
  );
}
