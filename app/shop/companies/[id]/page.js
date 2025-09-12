"use client";
import { use,useState, useEffect } from "react";
import Link from "next/link";
import styles from "./companies.module.css";

export default function CompaniesPage({ params }) {
  const { id } = use(params);
  const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const fetchCompanies = async () => {
            try {
                const res = await fetch(`/api/companies?id=${encodeURIComponent(id)}`);
                const data = await res.json();

                if (res.ok) {
                    setCompanies(data);
                } else {
                    console.error("Error:", data.error || "Failed to fetch companies");
                }
            } catch (err) {
                console.error("Error connecting to server:", err);
            }
            setLoading(false);
        }
        fetchCompanies();
    }, [id]);

  return (
    <div className={styles.body}>
      <h1>Companies in Category</h1>
      {loading ? (
        <p>Loading companies...</p>
      ) : companies.length > 0 ? (
        <div className={styles.companies}>
            {companies.map((company) => (
                <div key={company._id} className={styles.card}>
                    <h3>{company.name}</h3>
                    <p>{company.description}</p>
                    <Link href={`/shop/products/${encodeURIComponent(company._id)}`} className={styles.viewProducts}>
                        View Products
                    </Link>
                </div>
            ))}
        </div>
      ) : (
        <p>No company found in this category.</p>
      )}
    </div>
  );

}