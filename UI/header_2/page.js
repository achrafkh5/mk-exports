"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./header.module.css"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User, Shield } from "lucide-react";

export default function Header() {
  const [deletePop, setDeletePop] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
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

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo Section */}
        <Link href="/admin" className={styles.logo} prefetch={true}>
          <Image 
            src="/mk_exports_copy-removebg-preview.png" 
            width={40} 
            alt="mk exports" 
            height={40}
            className={styles.logoImage}
          />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>MK Exports</span>
            <span className={styles.logoSubtitle}>Admin Panel</span>
          </div>
        </Link>

        {/* Admin Actions */}
        <div className={styles.adminActions}>
          {/* Profile Dropdown */}
          <div className={styles.profileSection}>
            <button 
              className={styles.profileButton}
              onClick={toggleProfileDropdown}
              aria-label="Admin profile menu"
            >
              <div className={styles.avatarContainer}>
                <User size={20} />
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>Admin</span>
                <span className={styles.profileRole}>Administrator</span>
              </div>
              <i className={`fas fa-chevron-down ${styles.dropdownArrow} ${profileDropdown ? styles.dropdownOpen : ""}`}></i>
            </button>

            {/* Dropdown Menu */}
            {profileDropdown && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownItem}>
                  <Settings size={16} />
                  <span>Settings</span>
                </div>
                <div className={styles.dropdownItem}>
                  <Shield size={16} />
                  <span>Security</span>
                </div>
                <div className={styles.dropdownDivider}></div>
                <button 
                  className={`${styles.dropdownItem} ${styles.logoutItem}`}
                  onClick={() => {
                    setDeletePop(true);
                    setProfileDropdown(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {deletePop && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <LogOut size={24} />
              </div>
              <h2 className={styles.modalTitle}>Sign Out</h2>
              <p className={styles.modalDescription}>
                Are you sure you want to sign out? You&apos;ll need to log in again to access the admin panel.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton} 
                onClick={closeDelete} 
                disabled={popupLoading}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton} 
                onClick={confirmSignOut}
                disabled={popupLoading}
              >
                {popupLoading ? (
                  <div className={styles.spinner}></div>
                ) : (
                  <>
                    <LogOut size={16} />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {profileDropdown && (
        <div 
          className={styles.dropdownBackdrop} 
          onClick={() => setProfileDropdown(false)}
        />
      )}
    </header>
  );
}
