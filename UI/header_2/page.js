"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./header.module.css"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Header() {
  const [deletePop, setDeletePop] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const router = useRouter();
  const confirmSignOut = async() => {
    setPopupLoading(true);
    try {
        await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
    } catch (err) {
        console.error("Error during logout:", err);
    } finally {
        setPopupLoading(false);
        setDeletePop(false);
        router.push("/login");
    }
  }
  const closeDelete = () => {
    setDeletePop(false);
  }
  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/admin" className={styles.logo} prefetch={true}>
          <Image src={"/mk_exports_copy-removebg-preview.png"} width={60} alt="mk exports" height={60} /> MK Exports
        </Link>
        <div className={styles.logout} onClick={()=>setDeletePop(true)} title="Sign Out">
          <i className="fas fa-sign-out-alt" title="Sign Out" style={{fontSize:"25px"}}></i>
        </div>
      </div>
      {deletePop && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Sign Out</h2>
            <p>Are you sure you want to sign out ?</p>
            <div className={styles.popupActions}>
              <button className={styles.delete} onClick={confirmSignOut}>{popupLoading ? <div className={styles.spinnerr}></div> : "Logout"}</button>
              <button onClick={closeDelete} disabled={popupLoading} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
