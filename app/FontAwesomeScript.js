"use client"; // tells Next this runs only on the client

import { useEffect } from "react";

export default function FontAwesomeScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://use.fontawesome.com/releases/v5.8.1/js/all.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null; // this component doesn't render anything
}
