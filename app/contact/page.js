"use client";
import styles from "./page.module.css";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className={styles.contactBody}>
      <div className={styles.contactCard}>
        <h1 className={styles.contactTitle}>Contact Us</h1>
        <p className={styles.contactSubtitle}>We&apos;d love to hear from you! Fill out the form below and we&apos;ll get back to you soon.</p>

        <div className={styles.contactInfoSection}>
          <div className={styles.contactInfoRow}>
            <span className={styles.contactInfoLabel}>Phone:</span>
            <a href="tel:+1234567890" className={styles.contactInfoValue}>+1 234 567 890</a>
          </div>
          <div className={styles.contactInfoRow}>
            <span className={styles.contactInfoLabel}>Location:</span>
            <span className={styles.contactInfoValue}>123 Main St, City, Country</span>
          </div>
          <div className={styles.socialRow}>
            <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://tiktok.com/@yourprofile" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={loading}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className={styles.textarea}
            required
            disabled={loading}
          />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? <span className={styles.spinner}></span> : "Send Message"}
          </button>
        </form>
        {success && <div className={styles.successMsg}>Thank you! We&apos;ll be in touch soon.</div>}
        {error && <div className={styles.errorMsg}>{error}</div>}
      </div>
    </div>
  );
}
