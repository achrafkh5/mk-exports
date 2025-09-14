"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} prefetch={true}>
          mk exports
        </Link>

        {/* Hamburger button for mobile */}
        <button
          className={styles.hamburger}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((open) => !open)}
        >
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>

        <nav className={`${styles.nav} ${navOpen ? styles.navOpen : ""}`}>
          <Link href="/" prefetch={true}>Home</Link>
          <Link href="/login" prefetch={true}>account</Link>
          <Link href="/contact">Contact</Link>
          
        </nav>
        {/* Desktop WhatsApp button only */}
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsapp_btn + " " + styles.desktopWhatsapp}
        >
          WhatsApp <i className="fab fa-whatsapp" style={{fontSize:"20px"}}></i>
        </a>
        {/* Mobile floating WhatsApp button */}
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsapp_floating}
        >
          <i className="fab fa-whatsapp" style={{fontSize:"28px"}}></i>
        </a>
      </div>
    </header>
  );
}
