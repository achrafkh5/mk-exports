"use client";

import styles from "./signup.module.css"
import Link from "next/link";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";


function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [loading, setLoading] = useState(false);

  const removeError = (id) => {
    const errorElement = document.getElementById(id);
    if (errorElement) errorElement.remove();
  };

  const showError = (parentId, errorId, message, inputId) => {
    removeError(errorId);
    const parent = document.getElementById(parentId);
    const error = document.createElement("p");
    error.innerText = message;
    error.style.color = "red";
    error.id = errorId;
    parent.appendChild(error);
    document.getElementById(inputId).style.border = "solid 2px red";
  };
  const resetBorders = () => {
    document.getElementById("sign-mail").style.border = "solid 2px grey";
    document.getElementById("sign-pass").style.border = "solid 2px grey";
  };

  /*const handleSignUp = async () => {
    setLoading(true);
    resetBorders();
    removeError("err-mail");
    removeError("err-pass");

    


    try {
      if (!email || !pass || !conf) {
        alert("You need to fill all the fields");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("imail", "err-mail", "Enter a valid email address", "sign-mail");
        return;
      }

      if (pass.length <= 8 || !/[a-zA-Z]/.test(pass) || !/\d/.test(pass)) {
        showError("tell", "err-pass", "password should contain at least 8 characters , letters(a-b-..) and numbers(1-2-..)", "sign-pass");
        return;
      }
      if (pass !== conf) {
        showError("tell", "err-pass", "Passwords do not match", "sign-pass");
        return;
      }
      
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          password: pass,
          email: email,
        }),
      })
      const data = await res.json();

        if (!res.ok) {
          if(data.error==="Email found"){
            return showError("imail", "err-mail", "Email already registered", "sign-mail");
          } 
          else {
          console.log("error:",data.error);
          return;
        }}
      console.log("user created succesfuly");
      alert("check ur email for verifaction")
} catch(error){
    console.log("catched error:",error)
}finally {
      setLoading(false);
    }
  };
*/
  return (
    <div className={styles.body}>
      <div className={styles.login}>
        <div className={styles.ii} style={{ textAlign: "left", marginLeft: "20px" }}>
          <Link href="/" prefetch={true} style={{ cursor: "pointer" }}>
            <i className="fas fa-home" style={{ color: "black" }}></i>
          </Link>
        </div>
        <h1>Sign Up</h1>
        <div className={styles.email}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" id="sign-mail" required disabled={loading} />
          <i className="fa fa-envelope"></i>
        </div>
        <div id="imail"></div>
        <div className={styles.pass}>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Enter your password" id="sign-pass" required disabled={loading} />
          <i className="fas fa-lock"></i>
        </div>
        <div id="tell"></div>
        <div className={styles.conf}>
          <input type="password" value={conf} onChange={(e) => setConf(e.target.value)} placeholder="Confirm password" id="sign-conf" required disabled={loading} />
          <i className="fas fa-lock"></i>
        </div>
        <p>Already have an account? <Link href="/login" prefetch={true}><strong className={styles.strong}><span style={loading ? { pointerEvents: 'none', opacity: 0.7 } : {}}>Login</span></strong></Link></p>
        <button disabled={true} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
          {loading ? (
            <FaSpinner className={styles.spinner} style={{ marginRight: 8, fontSize: '1.2em', verticalAlign: 'middle' }} />
          ) : null}
          Sign Up
        </button>
      </div>
    </div>
  );


  };

export default Signup;
