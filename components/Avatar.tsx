const PALETTE = ["#f4c95d", "#2b2b2b", "#c9b8a6", "#e8a87c", "#8fb3a6", "#b8a4d6"];

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Avatar({ name, src, size = 28 }: { name: string; src?: string | null; size?: number }) {
  const bg = PALETTE[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
  if (src) return <img src={src} alt={name} className="avatar" style={{ width: size, height: size }} />;
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: bg, color: bg === "#2b2b2b" ? "#fff" : "#2b2b2b", fontSize: size * 0.38 }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}
