import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems, profile } from "../../data/portfolio.js";
import { useActiveSection } from "../../hooks/useActiveSection.js";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const firstMobileLinkRef = useRef(null);
  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);
  const activeSection = useActiveSection(sectionIds);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.25,
  });

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMobileLinkRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="site-header">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="container header-inner">
        <a className="brand" href="#top">
          <span className="brand__mark">EW</span>
          <span className="brand__copy">
            <strong>Eduardo W.</strong>
            <small>backend / mobile</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a
              className={activeSection === item.id ? "is-active" : undefined}
              href={item.href}
              key={item.id}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-contact" href={`mailto:${profile.email}`}>
          Contato <ArrowUpRight size={15} aria-hidden="true" />
        </a>

        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="mobile-menu"
            id="mobile-navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container" aria-label="Navegação mobile">
              {navItems.map((item, index) => (
                <a
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  className={activeSection === item.id ? "is-active" : undefined}
                  href={item.href}
                  key={item.id}
                  onClick={() => setOpen(false)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
