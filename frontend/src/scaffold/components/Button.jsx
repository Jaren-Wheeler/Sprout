import React from "react";

export default function Button({ variant = "primary", ...props }) {
  const className = ["btn", `btn--${variant}`, props.className].filter(Boolean).join(" ");
  return <button {...props} className={className} />;
}
