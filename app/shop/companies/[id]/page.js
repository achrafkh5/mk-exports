"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import styles from "./companies.module.css";
import Image from "next/image";
import EmptyState from "@/UI/empty/page";
export default function CompaniesPage({ params }) {
  const { id } = use(params);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`/api/companies?id=${encodeURIComponent(id)}`);
        const data = await res.json();

        if (res.ok) {
          setCompanies(data);
        } else {
          console.error("Error:", data.error || "Failed to fetch companies");
        }
        const catRes = await fetch(`/api/admin/category?id=${encodeURIComponent(id)}`);
        const catData = await catRes.json();
        if (catRes.ok) {
          setCategory(catData);
        } else {
          console.error("Error:", catData.error || "Failed to fetch category");
        }
      } catch (err) {
        console.error("Error connecting to server:", err);
      }
      setLoading(false);
    };
    fetchCompanies();
  }, [id]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Explore {category.name} Options</h1>
  
  <p className={styles.intro}>
    Explore trusted companies that bring you the best products and services.  
    Each partner is carefully selected to provide quality and innovation.
  </p>

  <p className={styles.tagline}>
    “Connecting you with brands that matter.”
  </p>

      {loading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : companies.length > 0 ? (
        <div className={styles.subCategoryGrid}>
          {companies.map((company) => (
            <Link
              key={company._id}
              href={`/shop/products/${encodeURIComponent(company._id)}`}
              className={styles.subCard}
            >
              {company.avatar ?.url? (
                <Image src={company.avatar.url} alt={company.name} width={90} height={90} />
              ) : (
                <span className={styles.emoji}>🏢</span>
              )}
              <h3>{company.name}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
    title="No Companies Found"
    message="We couldn’t find any companies in this category yet. Check back soon!"
    actionText="Go Back"
    actionHref="/"
  />
      )}
    </div>
  );
}
