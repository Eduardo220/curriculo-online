import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

export function registerGsapPlugins() {
  if (!pluginsRegistered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    pluginsRegistered = true;
  }

  return { gsap, ScrollTrigger };
}

export function refreshScrollTriggers(safe = true) {
  if (typeof window === "undefined") return;
  registerGsapPlugins();
  ScrollTrigger.refresh(safe);
}

export { gsap, ScrollTrigger };
