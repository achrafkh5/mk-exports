"use client";

import Header from "@/UI/header_2/page";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import styles from "./layout.module.css";
import { useEffect, useState } from "react";
import { Menu, X, Home, Folder, Building2, Package, ChevronRight } from "lucide-react";

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

  // Generate breadcrumb trail
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: "Dashboard", href: "/admin", icon: Home, isActive: isActive("/admin") }
    ];

    if (pathname.startsWith("/admin/categories/") && params.id) {
      breadcrumbs.push({
        label: categoryName?.name || "Category",
        href: `/admin/categories/${params.id}`,
        icon: Building2,
        isActive: isActive(`/admin/categories/${params.id}`)
      });
    }

    if (pathname.startsWith("/admin/companies/") && params.id) {
      if (companyName?.categoryId) {
        breadcrumbs.push({
          label: categoryName?.name || "Category",
          href: `/admin/categories/${companyName.categoryId}`,
          icon: Building2,
          isActive: false
        });
      }
      breadcrumbs.push({
        label: companyName?.name || "Company",
        href: `/admin/companies/${params.id}`,
        icon: Package,
        isActive: isActive(`/admin/companies/${params.id}`)
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Navigation items based on current context
  const getNavigationItems = () => {
    const baseItems = [
      { 
        label: "Categories Overview", 
        href: "/admin", 
        icon: Folder,
        isActive: isActive("/admin"),
        description: "Manage all categories"
      }
    ];

    if (pathname.startsWith("/admin/categories/") && params.id) {
      baseItems.push({
        label: "Companies",
        href: `/admin/categories/${params.id}`,
        icon: Building2,
        isActive: isActive(`/admin/categories/${params.id}`),
        description: `Companies in ${categoryName?.name || "category"}`,
        isChild: true
      });
    }

    if (pathname.startsWith("/admin/companies/") && params.id) {
      if (companyName?.categoryId) {
        baseItems.push({
          label: "Companies",
          href: `/admin/categories/${companyName.categoryId}`,
          icon: Building2,
          isActive: isActive(`/admin/categories/${companyName.categoryId}`),
          description: `Companies in ${categoryName?.name || "category"}`,
          isChild: true
        });
      }
      baseItems.push({
        label: "Products",
        href: `/admin/companies/${params.id}`,
        icon: Package,
        isActive: isActive(`/admin/companies/${params.id}`),
        description: `Products in ${companyName?.name || "company"}`,
        isChild: true,
        isDeepChild: true
      });
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);

  return (
    <div className={styles.adminLayout}>
      <Header />
      
      {/* Mobile Menu Toggle */}
      <button
        className={styles.mobileToggle}
        onClick={handleSidebarToggle}
        aria-label="Toggle navigation menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className={styles.overlay} onClick={handleSidebarToggle} />}

      <div className={styles.adminContainer}>
        {/* Modern Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          {/* Sidebar Header */}
          <div className={styles.sidebarHeader}>
            <div className={styles.logoSection}>
              <div className={styles.logoIcon}>
                <i className="fas fa-chart-bar"></i>
              </div>
              <div>
                <h1 className={styles.logoTitle}>Admin Panel</h1>
                <p className={styles.logoSubtitle}>Management System</p>
              </div>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className={styles.breadcrumbSection}>
            <h3 className={styles.sectionTitle}>Navigation</h3>
            <div className={styles.breadcrumbContainer}>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className={styles.breadcrumbItem}>
                  <Link 
                    href={crumb.href} 
                    className={`${styles.breadcrumbLink} ${crumb.isActive ? styles.breadcrumbActive : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <crumb.icon size={16} />
                    <span>{crumb.label}</span>
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Navigation */}
          <nav className={styles.navigation}>
            <h3 className={styles.sectionTitle}>Quick Access</h3>
            <div className={styles.navItems}>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${item.isActive ? styles.navActive : ""} ${
                    item.isChild ? styles.navChild : ""
                  } ${item.isDeepChild ? styles.navDeepChild : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={styles.navIcon}>
                    <item.icon size={20} />
                  </div>
                  <div className={styles.navContent}>
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.description && (
                      <span className={styles.navDescription}>{item.description}</span>
                    )}
                  </div>
                  {item.isActive && <div className={styles.navIndicator} />}
                </Link>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className={styles.sidebarFooter}>
            <div className={styles.footerCard}>
              <div className={styles.footerIcon}>
                <i className="fas fa-info-circle"></i>
              </div>
              <div>
                <p className={styles.footerTitle}>Admin Dashboard</p>
                <p className={styles.footerText}>v2.0.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
