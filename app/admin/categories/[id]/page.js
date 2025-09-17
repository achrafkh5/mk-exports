"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../home.module.css";
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
  }
};

  const deleteComp = async () => {
    try {
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
    }
  };

  const editComp = async () => {
  try {
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
  }
};


  if (loading) return( <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>);

  return (
    <div>
      <h1 className={styles.heading}>Companies in {categoryName?.name}</h1>
      <button className={styles.addButton} onClick={addCat}>+ Add Company</button>

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
              <button className={styles.submitButton} onClick={submit}>Submit</button>
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
              <button className={styles.submitButton} onClick={editComp}>Save</button>
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
              <button className={styles.delete} onClick={deleteComp}>Delete</button>
              <button onClick={closeDelete} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr >
            <th>Name</th>
            <th>creation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies?.length>0?(<>{companies?.map((company) => (
            <tr key={company._id}>
              <td data-label="Name"><Image src={company?.avatar?.url || "../../public/file.svg"} height={40} width={40} alt={company.name}></Image> {company.name}</td>
              <td data-label="creation">{company.createdAt ? new Date(company.createdAt).toLocaleString() : "N/A"}</td>
              <td data-label="actions" className={styles.actions}>
                <button className={styles.edit} onClick={() => openEdit(company)}>
                  Edit <i className="fas fa-pen"></i>
                </button>
                <button className={styles.delete} onClick={() => openDelete(company)}>
                  Delete <i className="fas fa-trash"></i>
                </button>
                <Link
                  href={`/admin/companies/${encodeURIComponent(company._id)}`}
                  className={styles.link}
                >
                  ▶ Companies
                </Link>
              </td>
            </tr>
          ))}</>)
          :<tr><td colSpan="3">No companies available</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
