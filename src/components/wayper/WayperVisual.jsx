import { motion, useReducedMotion } from "framer-motion";
import { CloudOff, LocateFixed, RefreshCw } from "lucide-react";

const activeCells = new Set([
  10, 11, 18, 19, 20, 26, 27, 28, 29, 35, 36, 37, 43, 44, 45, 51, 52,
]);

const territoryPath =
  "M208 88 H392 Q412 88 412 108 V168 Q412 188 432 188 H492 Q512 188 512 208 V268 Q512 288 532 288 H592 Q612 288 612 308 V592 Q612 612 592 612 H532 Q512 612 512 632 V692 Q512 712 492 712 H308 Q288 712 288 692 V432 Q288 412 268 412 H208 Q188 412 188 392 V108 Q188 88 208 88 Z";

export default function WayperVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="wayper-map"
      role="img"
      aria-label="Representação abstrata de um território conquistado e contornado no mapa"
    >
      <div className="wayper-map__topography" aria-hidden="true" />
      <div className="wayper-map__streets" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="wayper-map__cells" aria-hidden="true">
        {Array.from({ length: 64 }, (_, index) => (
          <motion.span
            className={activeCells.has(index) ? "is-captured" : ""}
            key={index}
            initial={false}
            animate={
              !reduceMotion && activeCells.has(index)
                ? { opacity: [0.28, 0.78, 0.48] }
                : undefined
            }
            transition={{
              duration: 3.8,
              delay: (index % 8) * 0.09,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <svg
        className="wayper-map__territory"
        viewBox="0 0 800 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="wayper-map__territory-shadow"
          d={territoryPath}
        />
        <motion.path
          d={territoryPath}
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={reduceMotion ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, delay: 0.25, ease: "easeInOut" }}
        />
      </svg>

      <span className="wayper-map__gps" aria-hidden="true">
        <LocateFixed size={20} />
      </span>

      <div className="wayper-map__metric wayper-map__metric--distance" aria-hidden="true">
        <small>território</small>
        <strong>área ativa</strong>
        <span>limite registrado</span>
      </div>

      <div className="wayper-map__metric wayper-map__metric--sync" aria-hidden="true">
        <RefreshCw size={15} />
        <span>área salva</span>
        <i>ok</i>
      </div>

      <div className="wayper-map__metric wayper-map__metric--offline" aria-hidden="true">
        <CloudOff size={15} />
        <span>funciona offline</span>
      </div>

      <div className="wayper-map__legend" aria-hidden="true">
        <span>
          <i className="is-lime" /> conquistado
        </span>
        <span>
          <i className="is-blue" /> sincronizado
        </span>
      </div>
    </div>
  );
}
