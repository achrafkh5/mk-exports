
import Link from "next/link";
import styles from "./header.module.css"; 

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/" className={styles.logo} prefetch={true}>
          mk exports
        </Link>

        <nav className={styles.nav}>
          <Link href="/" prefetch={true}>Home</Link>
          <Link href="/login" prefetch={true}>account</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsapp_btn}
        >
          WhatsApp <i className="fab fa-whatsapp" style={{fontSize:"20px"}}></i>
        </a>
      </div>
    </header>
  );
}
