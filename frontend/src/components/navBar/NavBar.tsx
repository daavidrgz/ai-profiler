import { useCallback, useEffect, useState } from "react";
import styles from "./navBar.module.scss";
import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    console.log("scrolling");
    if (window.scrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY, controlNavbar]);

  return (
    <nav className={styles.navbar} data-is_visible={show}>
      <span className={styles.logo} onClick={() => router.push("/")}>
        <span className="bold">AI</span> PROFILER
      </span>
    </nav>
  );
}
