"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "../../home-modern.module.css";
import Image from "next/image";

export default function ProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catin, setCatin] = useState("");
  const [file, setFile] = useState(null);
  const [pop, setPop] = useState(false);
  const [editPop, setEditPop] = useState(false);
  const [deletePop, setDeletePop] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);
  const [categoryName, setCategoryName] = useState([]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        } else {
          console.error("Error:", data.error || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error connecting to server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/company?id=${id}`);
        const data = await res.json();
        if (res.ok) setCategoryName(data);
      } catch (err) {
        console.error("Error fetching sidebar names:", err);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );

  const addCat = () => {
    setPop(true);
  };

  const openEdit = (cat) => {
    setSelectedCat(cat);
    setEditName(cat.name);
    setEditPrice(cat.price);
    setEditDescription(cat.description);
    setEditPop(true);
  };

  const openDelete = (cat) => {
    setSelectedCat(cat);
    setDeletePop(true);
  };

  const closeEdit = () => {
    setEditPop(false);
    setSelectedCat(null);
    setEditName("");
    setEditFile(null);
    setEditPrice("");
    setEditDescription("");
  };

  const closeDelete = () => {
    setDeletePop(false);
    setSelectedCat(null);
  };

  const submit = async () => {
    setPopupLoading(true);
    try {
      if (!catin || !file || !price || !description) {
        alert("Please fill in all fields");
        setPopupLoading(false);
        return;
      }

      // First: upload image
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const respond = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await respond.json();

      if (!respond.ok) {
        throw new Error(uploadData.error || "Image upload failed");
      }

      // Second: create product (JSON body)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: catin,
          avatar: uploadData.avatar,
          price: price,
          description: description,
          companyId: id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Product creation failed");
      }

      if (products?.length > 0) {
        setProducts((prev) => [...prev, data.product]);
      } else {
        setProducts([data.product]);
      }
      console.log("✅ Product created successfully");
      setFile(null);
      setCatin("");
      setPrice("");
      setDescription("");
      setPop(false);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupLoading(false);
    }
  };

  const deleteProduct = async () => {
    setPopupLoading(true);
    try {
      if (!selectedCat || !selectedCat._id) {
        alert("No product selected for deletion");
        setPopupLoading(false);
        return;
      }
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: selectedCat._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((cat) => cat._id !== selectedCat._id));
      console.log("✅ Product deleted successfully");
      closeDelete();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setPopupLoading(false);
    }
  };

  const editProduct = async () => {
    setPopupLoading(true);
    try {
      if (!editName || !editPrice || !editDescription) {
        alert("Please fill in all fields");
        setPopupLoading(false);
        return;
      }
      let avatar = selectedCat.avatar;

      // Upload new image if chosen
      if (editFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", editFile);

        const respond = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        const uploadData = await respond.json();
        if (!respond.ok) throw new Error(uploadData.error || "Image upload failed");

        avatar = uploadData.avatar;

        // Delete old image if it exists
        if (selectedCat.avatar?.public_id) {
          const deleteRes = await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id: selectedCat.avatar.public_id }),
          });

          const deleteData = await deleteRes.json();
          if (!deleteRes.ok) throw new Error(deleteData.error || "Failed to delete old image");
        }
      }
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: selectedCat._id,
          name: editName,
          avatar,
          price: editPrice,
          description: editDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setProducts((prev) =>
        prev.map((cat) =>
          cat._id === selectedCat._id
            ? { ...cat, name: editName, avatar, price: editPrice, description: editDescription }
            : cat
        )
      );
      console.log("✅ Product updated successfully");
      closeEdit();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setPopupLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Header Section */}
      <div className={styles.adminHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Products Management</h1>
          <p className={styles.pageSubtitle}>Manage products for {categoryName?.name}</p>
        </div>
        <button className={styles.addButton} onClick={addCat}>
          <i className="fas fa-plus"></i>
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-box"></i>
          </div>
          <div className={styles.statContent}>
            <h3>{products?.length || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className={styles.statContent}>
            <h3>Active</h3>
            <p>Status</p>
          </div>
        </div>
      </div>

      {/* Add Product Popup */}
      {pop && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Add New Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              value={catin}
              onChange={(e) => setCatin(e.target.value)}
              className={styles.input}
              disabled={popupLoading}
            />
            <input
              type="text"
              placeholder="Product Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles.input}
              disabled={popupLoading}
            />
            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
              disabled={popupLoading}
              rows={4}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className={styles.input}
              disabled={popupLoading}
            />
            <div className={styles.popupActions}>
              <button className={styles.submitButton} onClick={submit} disabled={popupLoading}>
                {popupLoading ? <span className={styles.spinner}></span> : "Submit"}
              </button>
              <button
                onClick={() => {
                  setPop(false);
                  setCatin("");
                  setFile(null);
                  setPrice("");
                  setDescription("");
                }}
                className={styles.cancelButton}
                disabled={popupLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Popup */}
      {editPop && selectedCat && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Edit Product</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className={styles.input}
              disabled={popupLoading}
            />
            <input
              type="text"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className={styles.input}
              disabled={popupLoading}
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className={styles.input}
              disabled={popupLoading}
              rows={4}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFile(e.target.files[0])}
              className={styles.input}
              disabled={popupLoading}
            />
            <div className={styles.popupActions}>
              <button className={styles.submitButton} onClick={editProduct} disabled={popupLoading}>
                {popupLoading ? <span className={styles.spinner}></span> : "Save"}
              </button>
              <button onClick={closeEdit} className={styles.cancelButton} disabled={popupLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Popup */}
      {deletePop && selectedCat && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Delete Product</h2>
            <p>Are you sure you want to delete <b>{selectedCat.name}</b>?</p>
            <div className={styles.popupActions}>
              <button className={styles.delete} onClick={deleteProduct} disabled={popupLoading}>
                {popupLoading ? <span className={styles.spinner}></span> : "Delete"}
              </button>
              <button onClick={closeDelete} className={styles.cancelButton} disabled={popupLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>All Products</h2>
        {products?.length > 0 ? (
          <div className={styles.categoriesGrid}>
            {products.map((product) => (
              <div key={product._id} className={styles.categoryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.categoryInfo}>
                    <div className={styles.categoryAvatar}>
                      <Image
                        src={product?.avatar?.url || "/public/file.svg"}
                        height={48}
                        width={48}
                        alt={product.name}
                        className={styles.avatarImage}
                      />
                    </div>
                    <div className={styles.categoryDetails}>
                      <h3 className={styles.categoryName}>{product.name}</h3>
                      <p className={styles.categoryDate}>
                        Price: {product.price ? `$${product.price}` : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className={styles.categoryStatus}>
                    <span className={styles.statusBadge}>In Stock</span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionEdit} onClick={() => openEdit(product)}>
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button className={styles.actionDelete} onClick={() => openDelete(product)}>
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                  <button
                    className={styles.actionView}
                    onClick={() => toggleExpand(product._id)}
                  >
                    <i className="fas fa-eye"></i>
                    {expandedId === product._id ? "Hide" : "View"}
                  </button>
                </div>
                {expandedId === product._id && (
                  <div style={{ marginTop: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem" }}>
                    <p><strong>Description:</strong> {product.description || "No description available"}</p>
                    <p><strong>Created:</strong> {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fas fa-box"></i>
            </div>
            <h3>No Products Found</h3>
            <p>Start by creating your first product for this company</p>
            <button className={styles.emptyButton} onClick={addCat}>
              <i className="fas fa-plus"></i>
              Create Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
