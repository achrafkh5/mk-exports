"use client";
import styles from "./products.module.css";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import EmptyState from "@/UI/empty/page";

export default function ProductsPage({ params }) {
  const { id } = use(params);
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
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
    };
    fetchProducts();
  }, [id]);

  return (
    <div className={styles.body}>
      <h1 className={styles.heroTitle}>{company?.name} Products</h1>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : products.length > 0 ? (
        <div className={styles.products}>
          {products.map((product) => (
            <div
              key={product._id}
              className={styles.card}
              onClick={() => setSelectedProduct(product)}
              style={{ cursor: "pointer" }}
            >
              {product.avatar?.url && (
                <Image
                  src={product.avatar.url}
                  alt={product.name}
                  width={160}
                  height={160}
                  style={{ objectFit: 'cover', borderRadius: '1rem', marginBottom: '1rem' }}
                />
              )}
              <h3>{product.name}</h3>
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

      {/* Product Modal Popup */}
      {selectedProduct && (
        <div className={styles.popupOverlay} onClick={() => setSelectedProduct(null)}>
          <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
            {selectedProduct.avatar?.url && (
              <Image
                src={selectedProduct.avatar.url}
                alt={selectedProduct.name}
                width={200}
                height={200}
                style={{ objectFit: 'cover', borderRadius: '1rem', marginBottom: '1rem' }}
              />
            )}
            <div className={styles.wst}>
            <h2 style={{ marginBottom: '0.5rem' }}>{selectedProduct.name}</h2>
            <div className={styles.price} style={{ marginBottom: '0.7rem' }}>{selectedProduct.price ? `${selectedProduct.price} $` : "Contact for price"}</div>
            </div>
            <div className={styles.description} style={{ color: '#444', marginBottom: '1rem', fontSize: '1.05rem' }}><b><i>description: </i></b>{selectedProduct.description || "No description available."}</div>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.7rem 1.5rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '0.5rem',
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.10)'
              }}
              className={styles.close_btn}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
