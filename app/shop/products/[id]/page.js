"use client";
import styles from "./products.module.css";
import { use,useState,useEffect } from "react";
import Image from "next/image";
import EmptyState from "@/UI/empty/page";

export default function ProductsPage({ params }) {
  const { id } = use(params);
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`);
                const data = await res.json();

                if (res.ok) {
                    setProducts(data);
                } else {
                    console.error("Error:", data.error || "Failed to fetch companies");
                }
                const catRes = await fetch(`/api/admin/company?id=${encodeURIComponent(id)}`);
                const catData = await catRes.json();
                if (catRes.ok) {
                    setCompany(catData);
                } else {
                    console.error("Error:", catData.error || "Failed to fetch category");
                }
            } catch (err) {
                console.error("Error connecting to server:", err);
            }
            setLoading(false);
        }
        fetchProducts();
    }, [id]);
  return(
    <div className={styles.body}>
      <h1 className={styles.heroTitle}>{company?.name} Products</h1>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : products.length > 0 ? (
        <div className={styles.products}>
          {products.map((product) => (
            <div key={product._id} className={styles.card}>
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={160}
                  height={160}
                  style={{ objectFit: 'cover', borderRadius: '1rem', marginBottom: '1rem' }}
                />
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className={styles.price}>{product.price ? `${product.price} DA` : "Contact for price"}</div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
            title="No Products Found"
            message="We couldn’t find any Products in this brand yet. Check back soon!"
            actionText="Go Back"
            actionHref={`/shop/companies/${encodeURIComponent(company.categoryId)}`}
          />
      )}
    </div>
  );
}
