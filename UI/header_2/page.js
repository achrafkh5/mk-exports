
import Link from "next/link";
import styles from "./header.module.css"; 

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/admin" className={styles.logo} prefetch={true}>
          MK exports
        </Link>

      </div>
    </header>
  );
}
