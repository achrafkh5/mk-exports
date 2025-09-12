"use client";

import styles from "./login.module.css";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginn = async () => {
    setLoading(true);

    if (!email || !pass) {
      alert("Please enter both email/phone and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: pass }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setLoading(false);
        router.push("/admin");
      } else {
        alert(data.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      alert("Error connecting to server");
      console.error(err);
      setLoading(false);
    }
  };

  return (
        <div className={styles.body}>
            <div className={styles.login}>
                <div className={styles.ii} style={{ textAlign: "left", color: "black" }}>
                    <Link href="/" prefetch={true} style={{ cursor: "pointer" }}>
                        <i className="fas fa-home" style={{ color: "rgb(0, 0, 0)" }}></i>
                    </Link>
                </div>
                <h1>Login</h1>
                <div className={styles.email} id="login-email">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="enter your email"
                        id="login-mail"
                        required
                        disabled={loading}
                    />
                    <i className="fas fa-user"></i>
                </div>
                <div id="imail"></div>
                <div className={`${styles.pass} ${styles.color}`} id="login-password">
                    <input
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="enter your password"
                        id="login-pass"
                        required
                        disabled={loading}
                    />
                    <i className="fas fa-lock" ></i>
                </div>
                <div id="passw"></div>
                <div className={styles.footer}>
                    <button id="check-btn" onClick={loginn} disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : { }}>
                        {loading ? (
                            <FaSpinner className={styles.spinner} style={{ marginRight: 8, fontSize: '1.2em', verticalAlign: 'middle' }} />
                        ) : null}
                        Login
                    </button>
                </div>
                <p> dont have an account? <Link href="/signup" prefetch={true}><strong className={styles.strong}><span style={loading ? { pointerEvents: 'none', opacity: 0.7 } : {}}>sign up</span></strong></Link></p>
            </div>
        </div>
    );
}
