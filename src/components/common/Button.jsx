import { ArrowUpRight } from "lucide-react";

export default function Button({
  href,
  children,
  icon: Icon = ArrowUpRight,
  variant = "primary",
  download = false,
  className = "",
}) {
  const external = href?.startsWith("http");

  return (
    <a
      className={`button button--${variant} ${className}`.trim()}
      href={href}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span>{children}</span>
      {Icon ? <Icon size={17} strokeWidth={1.8} aria-hidden="true" /> : null}
    </a>
  );
}
