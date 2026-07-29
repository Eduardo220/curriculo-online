import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems, profile } from "../../data/portfolio.js";
import { useActiveSection } from "../../hooks/useActiveSection.js";
import { useGsapContext } from "../../hooks/useGsapContext.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

export default function Header() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstMobileLinkRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);
  const activeSection = useActiveSection(sectionIds);
  const reducedMotion = useReducedMotion();

  const setupScrollState = useCallback(({ gsap, ScrollTrigger }) => {
    let compact = false;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(".scroll-progress", { scaleX: self.progress });
        const nextCompact = self.scroll() > 56;
        if (nextCompact !== compact) {
          compact = nextCompact;
          rootRef.current?.classList.toggle("is-compact", compact);
        }
      },
    });

    return () => trigger.kill();
  }, []);

  useGsapContext(setupScrollState, { scope: rootRef });

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const inertTargets = [document.querySelector("main"), document.querySelector(".site-footer")]
      .filter(Boolean);
    document.body.style.overflow = "hidden";
    inertTargets.forEach((target) => target.setAttribute("inert", ""));

    const focusFrame = window.requestAnimationFrame(() => {
      firstMobileLinkRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [
        menuButtonRef.current,
        ...(mobileMenuRef.current?.querySelectorAll("a[href]") ?? []),
      ].filter(Boolean);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      inertTargets.forEach((target) => target.removeAttribute("inert"));
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header ref={rootRef} className="site-header">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Eduardo Weissheimer — voltar ao início">
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
            ref={mobileMenuRef}
            className="mobile-menu"
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navegação do portfólio"
            data-lenis-prevent
            initial={reducedMotion ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="container" aria-label="Navegação mobile">
              {navItems.map((item, index) => (
                <a
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  className={activeSection === item.id ? "is-active" : undefined}
                  href={item.href}
                  key={item.id}
                  aria-current={activeSection === item.id ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
