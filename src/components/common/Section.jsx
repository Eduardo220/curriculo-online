import { motion, useReducedMotion } from "framer-motion";

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={`section ${className}`.trim()}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container">
        {(eyebrow || title || description) && (
          <header className="section-heading">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            {title ? <h2>{title}</h2> : null}
            {description ? <p>{description}</p> : null}
          </header>
        )}
        {children}
      </div>
    </motion.section>
  );
}
