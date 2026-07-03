import { ArrowUpRight } from "lucide-react";

export default function Button({
  href,
  children,
  icon: Icon = ArrowUpRight,
  variant = "primary",
  download = false,
  disabled = false,
}) {
  const className = `button button-${variant}${disabled ? " is-disabled" : ""}`;

  if (disabled || !href) {
    return (
      <span className={className} aria-disabled="true">
        {Icon && <Icon size={17} aria-hidden="true" />}
        {children}
      </span>
    );
  }

  const external = href.startsWith("http");

  return (
    <a
      className={className}
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {Icon && <Icon size={17} aria-hidden="true" />}
      {children}
    </a>
  );
}
