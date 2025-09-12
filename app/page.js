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
    <>
      <Header />
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to My Shop</h1>
          <p>Find everything you need at the best prices</p>
          <Link href="/shop/products" className={styles.shopNow}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categoriesSection}>
        <h2>Find a Category</h2>
        <div className={styles.categories}>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id}
                href={`shop/companies/${encodeURIComponent(cat._id)}`}
                className={styles.card}
              >
                <h3>{cat.name}</h3>
              </Link>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
      </section>
    </>
  );
}
