// components/Footer.jsx
import Link from "next/link";
import styles from "./footer.module.css";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo / Shop name */}
        <div className={styles.footer_left}>
          <div className={styles.logo}><Image src={"/colored-logo (1).png"} width={60} alt="mk exports" height={60} /> <h2 className={styles.foote_logor}>MK Exports</h2></div>
          <p>Best place to find products from top companies.</p>
        </div>

        {/* Navigation */}
        <nav className={styles.footer_nav}>
          <Link href="/" prefetch={true}>Home</Link>
          <Link href="/login" prefetch={true}>account</Link>
          <Link href="/contact" prefetch={true}>Contact</Link>
        </nav>

        {/* Contact Info */}
        <div className={styles.footer_contact}>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=mk.exports.algeria@gmail.com" target="_blank">mk.exports.algeria@gmail.com</a>
          <a href="tel:+213659911059">+213 659 91 10 59</a>
          <a
            href="https://wa.me/213659911059"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className={styles.footer_bottom}>
        <p>© {new Date().getFullYear()} Mk Exports. All rights reserved.</p>
      </div>
    </footer>
  );
}
