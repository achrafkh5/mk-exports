// components/Footer.jsx
import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo / Shop name */}
        <div className={styles.footer_left}>
          <h2 className={styles.foote_logor}>MyShop</h2>
          <p>Best place to find products from top companies.</p>
        </div>

        {/* Navigation */}
        <nav className={styles.footer_nav}>
          <Link href="/">Home</Link>
          <Link href="/companies">Companies</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Contact Info */}
        <div className={styles.footer_contact}>
          <a href="mailto:admin@myshop.com">admin@myshop.com</a>
          <a href="tel:+1234567890">+1 234 567 890</a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className={styles.footer_bottom}>
        <p>© {new Date().getFullYear()} MyShop. All rights reserved.</p>
      </div>
    </footer>
  );
}
