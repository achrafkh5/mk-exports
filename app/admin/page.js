"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import Image from "next/image";
export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catin, setCatin] = useState("");
  const [file, setFile] = useState(null);
  const [pop, setPop] = useState(false);
  const [editPop, setEditPop] = useState(false);
  const [deletePop, setDeletePop] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories",
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        } else {
          console.error("Error:", data.error || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error connecting to server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return( <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>);

  const addCat = () => {
    setPop(true);
  };

  const openEdit = (cat) => {
    setSelectedCat(cat);
    setEditName(cat.name);
    setEditFile(null);
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
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: catin,
        avatar:uploadData.avatar,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Category creation failed");
    }

    if (categories?.length > 0) {
        setCategories((prev) => [...prev, data.category]);
    } else{
        setCategories([data.category]); 
    }
    console.log("✅ category created successfully");
    setFile(null);
    setCatin("");
    setPop(false);
  } catch (error) {
    console.error(error);
  }
};

  const deleteCat = async () => {
    try {
      if (!selectedCat || !selectedCat._id) {
        alert("No category selected for deletion");
        return;
      }
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
        body: JSON.stringify({ id: selectedCat._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }
      setCategories((prev) => prev.filter((cat) => cat._id !== selectedCat._id));
      console.log("✅ Category deleted successfully");
      closeDelete();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const editCat = async () => {
    try {
      if (!editName) {
        alert("Category name cannot be empty");
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
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
        body: JSON.stringify({
          id: selectedCat._id,
          name: editName,
        avatar,})
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === selectedCat._id ? { ...cat, name: editName,avatar } : cat
        )
      );
      console.log("✅ Category updated successfully");
      closeEdit();
    } catch (error) {
      console.error("Error updating category:", error);
    }}

  return (
    <div className={styles.body}>
      <h1 className={styles.heading}>Categories</h1>
      <button className={styles.addButton} onClick={addCat}>+ Add Category</button>

      {/* Add Category Popup */}
      {pop && (
        <div className={styles.popup}>
          <div className={styles.popupContent}> 
            <h2>Add New Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={catin}
              onChange={(e) => setCatin(e.target.value)}
              className={styles.input}
            />
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className={styles.input}
            />
            <div className={styles.popupActions}>
              <button onClick={submit} className={styles.submitButton}>Submit</button>
              <button onClick={() =>{ setPop(false); setCatin("");setFile(null)} } className={styles.cancelButton}>Cancel</button>
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFile(e.target.files[0])}
              className={styles.input}
            />
            <div className={styles.popupActions}>
              <button className={styles.submitButton} onClick={editCat}>Save</button>
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
            <th>creation</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories?.length>0 ?(<>{categories?.map((cat) => (
            <tr key={cat._id}>
              <td data-label="Name"><Image src={cat?.avatar?.url || "../../public/file.svg"} height={30} width={30} alt={cat.name}></Image> {cat.name}</td>
              <td data-label="creation">{cat.createdAt ? new Date(cat.createdAt).toLocaleString() : "N/A"}</td>
              <td data-label="actions" className={styles.actions}>
                <button className={styles.edit} onClick={() => openEdit(cat)}>
                  <p>Edit</p> <i className="fas fa-pen"></i>
                </button>
                <button className={styles.delete} onClick={() => openDelete(cat)}>
                  <p>Delete</p> <i className="fas fa-trash"></i>
                </button>
                <Link
                  href={`/admin/categories/${encodeURIComponent(cat._id)}`}
                  className={styles.link}
                >
                  <p>Companies</p> <i className="fas fa-store"></i>
                </Link>
              </td>
            </tr>
          ))}</>)
          :(<tr><td colSpan="3">No categories available</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
