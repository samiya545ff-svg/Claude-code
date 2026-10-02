"use client";

import { useEffect, useState } from "react";

/** Asks for a second click instead of a browser confirm() dialog. */
export default function ConfirmButton({
  onConfirm,
  children,
  confirmText = "Click again to confirm",
  className,
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  confirmText?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else setArmed(true);
      }}
    >
      {armed ? confirmText : children}
    </button>
  );
}
