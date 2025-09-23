
import Link from "next/link";
import styles from "./header.module.css"; 
import Image from "next/image";
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/admin" className={styles.logo} prefetch={true}>
          <Image src="../../public/mk exports.jpg" width={50} alt="mk exports" height={50} />
        </Link>

      </div>
    </header>
  );
}
