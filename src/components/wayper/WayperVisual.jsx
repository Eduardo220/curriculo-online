import { motion, useReducedMotion } from "framer-motion";
import { CloudOff, LocateFixed, RefreshCw } from "lucide-react";

const activeCells = new Set([
  10, 11, 18, 19, 20, 26, 27, 28, 29, 35, 36, 37, 43, 44, 45, 51, 52, 59,
]);

export default function WayperVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="wayper-map"
      role="img"
      aria-label="Representação abstrata de uma rota de corrida conquistando células territoriais no mapa"
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

      <svg className="wayper-map__route" viewBox="0 0 640 520" aria-hidden="true">
        <path
          className="wayper-map__route-shadow"
          d="M58 454 C 142 424, 104 338, 184 324 S 286 390, 330 302 S 306 202, 402 196 S 482 106, 584 54"
        />
        <motion.path
          d="M58 454 C 142 424, 104 338, 184 324 S 286 390, 330 302 S 306 202, 402 196 S 482 106, 584 54"
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
        <small>distância</small>
        <strong>rota ativa</strong>
        <span>pontos confiáveis</span>
      </div>

      <div className="wayper-map__metric wayper-map__metric--sync" aria-hidden="true">
        <RefreshCw size={15} />
        <span>fila de sync</span>
        <i>pronta</i>
      </div>

      <div className="wayper-map__metric wayper-map__metric--offline" aria-hidden="true">
        <CloudOff size={15} />
        <span>offline-first</span>
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
