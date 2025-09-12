"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "../../home.module.css";
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

  const [categoryName, setCategoryName] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const res = await fetch(`/api/admin/company?id=${id}`);
          const data = await res.json();
          if (res.ok) setCategoryName(data);
        }
       catch (err) {
        console.error("Error fetching sidebar names:", err);
      }
    };
    fetchData();
  }, [id]);

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
  };

  const closeDelete = () => {
    setDeletePop(false);
    setSelectedCat(null);
  };
  

  const submit = async () => {
    try {
      if (!catin || !file) {
        alert("you need to fill the inputs");
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


    // Second: create category (JSON body)
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: catin,
        avatar:uploadData.avatar,
        companyId: id,
        price,
        description,
        categoryId: categoryName._id
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "product creation failed");
    }

    if (products?.length > 0) {
        setProducts((prev) => [...prev, data.product]);
    } else{
        setProducts([data.product]); 
    }
    console.log("✅ product created successfully");
    setFile("");
    setCatin("");
    setPrice("");
    setDescription("");
    setPop(false);
  } catch (error) {
    console.error(error);
  }
};

  const deleteCat = async () => {
    try {
      if (!selectedCat || !selectedCat._id) {
        alert("No product selected for deletion");
        return;
      }
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: selectedCat._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((cat) => cat._id !== selectedCat._id));
      console.log("✅ product deleted successfully");
      closeDelete();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const editCat = async () => {
    try {
      if (!editName || !selectedCat) {
        alert("Please provide a product name.");
        return;
      }
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({ id: selectedCat._id, name: editName, price: editPrice, description: editDescription }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }
      setProducts((prev) => prev.map((cat) => (cat._id === selectedCat._id ? data.product : cat)));
      console.log("✅ product updated successfully");
      closeEdit();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <h1 className={styles.heading}>Products in {categoryName?.name}</h1>
      <button className={styles.addButton} onClick={addCat}>+ Add Product</button>

      {pop && (
              <div className={styles.popup}>
                <div className={styles.popupContent}> 
                  <h2>Add New product</h2>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={catin}
                    onChange={(e) => setCatin(e.target.value)}
                    className={styles.input}
                  />
                  <input type="text" placeholder="description" className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} />
                  <input type="number" placeholder="price" className={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} />
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className={styles.input}
                  />
                  <div className={styles.popupActions}>
                    <button onClick={submit} className={styles.submitButton}>Submit</button>
                    <button onClick={() =>{ setPop(false); setCatin("");setFile(null);setPrice("");setDescription("");} } className={styles.cancelButton}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
      
            {/* Edit Category Popup */}
            {editPop && selectedCat && (
              <div className={styles.popup}>
                <div className={styles.popupContent}>
                  <h2>Edit Category</h2>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.input}
                  />
                  <input type="text" placeholder="description" className={styles.input} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  <input type="number" placeholder="price" className={styles.input} value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                  <div className={styles.popupActions}>
                    <button className={styles.submitButton}>Save</button>
                    <button onClick={closeEdit} className={styles.cancelButton}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
      
            {/* Delete Category Popup */}
            {deletePop && selectedCat && (
              <div className={styles.popup}>
                <div className={styles.popupContent}>
                  <h2>Delete Category</h2>
                  <p>Are you sure you want to delete <b>{selectedCat.name}</b>?</p>
                  <div className={styles.popupActions}>
                    <button className={styles.delete} onClick={deleteCat}>Delete</button>
                    <button onClick={closeDelete} className={styles.cancelButton}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Description</th>
            <th>Creation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length>0? (<>{products.map((product) => (
            <tr key={product._id}>
              <td><Image src={product?.avatar?.url || "../../public/file.svg"} height={30} width={30} alt={product.name}></Image> {product.name}</td>
              <td>{product.price} DA</td>
              <td>{product.description}</td>
              <td>{new Date(product.createdAt).toLocaleString()}</td>
              <td className={styles.actions}>
                <button className={styles.edit} onClick={() => openEdit(product)}>
                  Edit <i className="fas fa-pen"></i>
                </button>
                <button className={styles.delete} onClick={() => openDelete(product)}>
                  Delete <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}</>): <tr><td colSpan="4">No products available.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
