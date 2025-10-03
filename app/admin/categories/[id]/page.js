"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../home-modern.module.css";
import Image from "next/image";

export default function CompaniesPage() {
  const { id } = useParams();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
    const [catin, setCatin] = useState("");
    const [file, setFile] = useState(null);
    const [pop, setPop] = useState(false);
    const [editPop, setEditPop] = useState(false);
    const [deletePop, setDeletePop] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [editName, setEditName] = useState("");
    const [editFile, setEditFile] = useState(null);
    const [popupLoading, setPopupLoading] = useState(false);

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
      } catch (err) {
        console.error("Error connecting to server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [id]);

  const [categoryName, setCategoryName] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const res = await fetch(`/api/admin/category?id=${id}`);
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
      setPopupLoading(true);
      if (!catin || !file) {
        alert("Please provide both category name and image.");
        return;
      }
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
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: catin,
        avatar:uploadData.avatar,
        categoryId: categoryName._id
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "company creation failed");
    }

    if (companies?.length > 0) {
        setCompanies((prev) => [...prev, data.company]);
    } else{
        setCompanies([data.company]); 
    }
    console.log("✅ category created successfully");
    setFile(null);
    setPop(false);
    setCatin("");
  } catch (error) {
    console.error(error);
  } finally {
    setPopupLoading(false);
  }
};

  const deleteComp = async () => {
    try {
      setPopupLoading(true);
      if (!selectedCat) return;
      const res = await fetch("/api/companies", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: selectedCat._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }
      setCompanies((prev) => prev.filter((cat) => cat._id !== selectedCat._id));
      console.log("✅ category deleted successfully");
      closeDelete();
    } catch (error) {
      console.error(error);
    } finally {
      setPopupLoading(false);
    }
  };

  const editComp = async () => {
  try {
    setPopupLoading(true);
    if (!editName || !selectedCat) {
      alert("Please provide a company name.");
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
    
    const res = await fetch("/api/companies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: selectedCat._id, name: editName, avatar }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update company");

    // Update local state
    setCompanies((prev) =>
      prev.map((comp) =>
        comp._id === selectedCat._id ? { ...comp, name: editName, avatar } : comp
      )
    );

    console.log("✅ Company updated successfully");
    closeEdit();
  } catch (error) {
    console.error("❌ Error updating company:", error.message);
  } finally {
    setPopupLoading(false);
  }
};


  if (loading) return( <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>);

  return (
    <div className={styles.adminContainer}>
      {/* Header Section */}
      <div className={styles.adminHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Companies Management</h1>
          <p className={styles.pageSubtitle}>Manage companies in {categoryName?.name}</p>
        </div>
        <button className={styles.addButton} onClick={addCat}>
          <i className="fas fa-plus"></i>
          Add Company
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-building"></i>
          </div>
          <div className={styles.statContent}>
            <h3>{companies?.length || 0}</h3>
            <p>Total Companies</p>
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
              disabled={popupLoading}
            />
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className={styles.input}
              disabled={popupLoading}
            />
            <div className={styles.popupActions}>
              <button className={styles.submitButton} onClick={submit}>{popupLoading ? <div className={styles.spinnerr}></div> : "Submit"}</button>
              <button disabled={popupLoading} onClick={() =>{ setPop(false); setCatin("");setFile(null)} } className={styles.cancelButton}>Cancel</button>
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
              disabled={popupLoading}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFile(e.target.files[0])}
              className={styles.input}
              disabled={popupLoading}
            />
            <div className={styles.popupActions}>
              <button className={styles.submitButton} onClick={editComp}>{popupLoading ? <div className={styles.spinnerr}></div> : "Save"}</button>
              <button onClick={closeEdit} disabled={popupLoading} className={styles.cancelButton}>Cancel</button>
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
              <button className={styles.delete} onClick={deleteComp}>{popupLoading ? <div className={styles.spinnerr}></div> : "Delete"}</button>
              <button onClick={closeDelete} disabled={popupLoading} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Companies Grid */}
      <div className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>All Companies</h2>
        {companies?.length > 0 ? (
          <div className={styles.categoriesGrid}>
            {companies.map((company) => (
              <div key={company._id} className={styles.categoryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.categoryInfo}>
                    <div className={styles.categoryAvatar}>
                      <Image 
                        src={company?.avatar?.url || "/public/file.svg"} 
                        height={48} 
                        width={48} 
                        alt={company.name}
                        className={styles.avatarImage}
                      />
                    </div>
                    <div className={styles.categoryDetails}>
                      <h3 className={styles.categoryName}>{company.name}</h3>
                      <p className={styles.categoryDate}>
                        Created {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className={styles.categoryStatus}>
                    <span className={styles.statusBadge}>Active</span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionEdit} onClick={() => openEdit(company)}>
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button className={styles.actionDelete} onClick={() => openDelete(company)}>
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                  <Link
                    href={`/admin/companies/${encodeURIComponent(company._id)}`}
                    className={styles.actionView}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fas fa-building"></i>
            </div>
            <h3>No Companies Found</h3>
            <p>Start by creating your first company in this category</p>
            <button className={styles.emptyButton} onClick={addCat}>
              <i className="fas fa-plus"></i>
              Create Company
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
