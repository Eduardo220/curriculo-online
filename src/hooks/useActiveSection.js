import { useEffect, useState } from "react";

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    let intersectionObserver;
    let mutationObserver;
    let refreshFrame = 0;

    const updateFromViewport = () => {
      const probe = window.innerHeight * 0.36;
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);
      const current = sections
        .map((section) => ({
          id: section.id,
          distance: Math.abs(section.getBoundingClientRect().top - probe),
        }))
        .sort((left, right) => left.distance - right.distance)[0];
      if (current) setActiveSection(current.id);
    };

    const observeSections = () => {
      intersectionObserver?.disconnect();
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (!("IntersectionObserver" in window)) {
        updateFromViewport();
        return;
      }

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((left, right) => right.intersectionRatio - left.intersectionRatio);
          if (visible[0]) setActiveSection(visible[0].target.id);
        },
        {
          rootMargin: "-24% 0px -60% 0px",
          threshold: [0.01, 0.18, 0.42, 0.7],
        },
      );

      sections.forEach((section) => intersectionObserver.observe(section));
    };

    const scheduleObserve = () => {
      if (refreshFrame) return;
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = 0;
        observeSections();
      });
    };

    observeSections();
    mutationObserver = new MutationObserver(scheduleObserve);
    mutationObserver.observe(document.querySelector("main") ?? document.body, {
      childList: true,
      subtree: true,
    });

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (sectionIds.includes(hash)) setActiveSection(hash);
    };
    window.addEventListener("hashchange", handleHashChange);

    if (!("IntersectionObserver" in window)) {
      window.addEventListener("scroll", updateFromViewport, { passive: true });
    }

    return () => {
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("scroll", updateFromViewport);
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    };
  }, [sectionIds]);

  return activeSection;
}
