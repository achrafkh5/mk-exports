
import Link from "next/link";
import styles from "./header.module.css"; 
import Image from "next/image";
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/admin" className={styles.logo} prefetch={true}>
          <Image src={"/mk_exports_copy-removebg-preview.png"} width={60} alt="mk exports" height={60} /> MK Exports
        </Link>

      </div>
    </header>
  );
}
