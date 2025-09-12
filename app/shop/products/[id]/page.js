"use client";
import styles from "./products.module.css";
import { use,useState,useEffect } from "react";


export default function ProductsPage({ params }) {
  const { id } = use(params);
  const [products, setProducts] = useState([]);
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
            } catch (err) {
                console.error("Error connecting to server:", err);
            }
            setLoading(false);
        }
        fetchProducts();
    }, [id]);
  return(
    <div className={styles.body}>
      <h1>Products Page</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div className={styles.products}>
            {products.map((product) => (
                <div key={product._id} className={styles.card}>
                    <h3>{product.name}</h3>
                    <p>description: {product.description}</p>
                    <p>Price: {product.price} DA</p>
                </div>
            ))}
        </div>
      ) : (
        <p>No products found for this company.</p>
      )}
    </div>
  );
}
