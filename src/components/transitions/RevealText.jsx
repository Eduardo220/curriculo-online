export default function RevealText({
  as: Component = "span",
  children,
  className = "",
}) {
  return (
    <Component className={`reveal-text ${className}`.trim()}>
      <span className="reveal-text__line">{children}</span>
    </Component>
  );
}
