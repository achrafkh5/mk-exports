"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Header from "@/UI/header/page";

export default function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        if (res.ok) {
          setCategories(data);
        } else {
          console.error("Error:", data.error || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error connecting to server:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={styles.body}>
      <Header />
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to MK Exports</h1>
          <p className={styles.heroSubtitle}>Find everything you need at the best prices</p>
          <a href="#find-category" className={styles.shopNow} onClick={e => {
            e.preventDefault();
            document.getElementById('find-category')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Shop Now
          </a>
        </div>
      </section>

    <section id="who" className={styles.infoSection}>
      <h2 className={styles.infoTitle}>Who We Are</h2>
      <p className={styles.infoContent}>
        Mk exports is an Algerian/Arab company specialized in exporting various produckts to global markets. We connect high-quality local products with international buyers, while strictly adhering to international standards in packaging, labeling, and shipping.
      </p>
    </section>

    <section id="capital" className={styles.infoSection}>
      <h2 className={styles.infoTitle}>Capital</h2>
      <p className={styles.infoContent}>
        10 millions algerian dinar
      </p>
    </section>

    <section id="countries" className={styles.infoSection}>
      <h2 className={styles.infoTitle}>Our Vision</h2>
      <p className={styles.infoContent}>
        To strengthen the presence of our products in the global market by providing reliable export solutions and building long-term business relationships based on trust, credibility, and professionalism.
      </p>
    </section>

      {/* Categories */}
  <section id="find-category" className={styles.categoriesSection}>
        <h2 className={styles.categoriesHeading}>Find a Category</h2>
        <div className={styles.categories}>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id}
                href={`shop/companies/${encodeURIComponent(cat._id)}`}
                className={styles.card}
                style={{
  backgroundImage: `url(${cat.avatar.url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
}}
              >
                <h3 className={styles.cardTitle}>{cat.name}</h3>
              </Link>
            ))
          ) : (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
