"use client";

import Header from "@/UI/header_2/page";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import styles from "./layout.module.css";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const pathname = usePathname();
  const params = useParams();

  const [categoryName, setCategoryName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href) => pathname === href;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (pathname.startsWith("/admin/categories/") && params.id) {
          const res = await fetch(`/api/admin/category?id=${params.id}`);
          const data = await res.json();
          if (res.ok) setCategoryName(data);
        } else if (pathname.startsWith("/admin/companies/") && params.id) {
          const res = await fetch(`/api/admin/company?id=${params.id}`);
          const data = await res.json();
          if (res.ok) {
            setCompanyName(data);
            const catRes = await fetch(
              `/api/admin/category?id=${data.categoryId}`
            );
            const catData = await catRes.json();
            if (catRes.ok) setCategoryName(catData);
          }
        }
      } catch (err) {
        console.error("Error fetching sidebar names:", err);
      }
    };
    fetchData();
  }, [pathname, params]);

  let sidebarContent = (
    <nav className={styles.nav}>
      <Link
        href="/admin"
        className={`${styles.navLink} ${
          isActive("/admin") ? styles.active : ""
        }`}
      >
        🗂️ Categories
      </Link>
    </nav>
  );

  if (pathname.startsWith("/admin/categories/") && params.id) {
    sidebarContent = (
      <nav className={styles.nav}>
        <Link href="/admin" className={styles.navLink}>
          🗂️ {categoryName?.name || "Categories"}
        </Link>
        <Link
          href={`/admin/categories/${params.id}`}
          className={`${styles.navLink} ${styles.childLink} ${
            isActive(`/admin/categories/${params.id}`) ? styles.active : ""
          }`}
        >
          🏢 Companies
        </Link>
      </nav>
    );
  }

  if (pathname.startsWith("/admin/companies/") && params.id) {
    sidebarContent = (
      <nav className={styles.nav}>
        <Link href="/admin" className={styles.navLink}>
          🗂️ {categoryName?.name || "Categories"}
        </Link>
        <Link
          href={`/admin/categories/${companyName?.categoryId}`}
          className={`${styles.navLink} ${styles.childLink} ${
            isActive(`/admin/categories/${companyName?.categoryId}`)
              ? styles.active
              : ""
          }`}
        >
          🏢 {companyName?.name || "Companies"}
        </Link>
        <Link
          href={`/admin/companies/${params.id}`}
          className={`${styles.navLink} ${styles.childLink2} ${
            isActive(`/admin/companies/${params.id}`) ? styles.active : ""
          }`}
        >
          📦 Products
        </Link>
      </nav>
    );
  }

  // Sidebar toggle button
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* Toggle button (top-right on mobile) */}
        <button
          className={styles.sidebarToggle}
          aria-label="Toggle admin dashboard sidebar"
          onClick={handleSidebarToggle}
          style={{textAlign:"right"}}
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <h2 className={styles.title}>Admin Dashboard</h2>
          {sidebarContent}
        </aside>

        {/* Main Content */}
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}
