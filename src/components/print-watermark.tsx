function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function PrintWatermark({ text }: { text: string }) {
  const label = escapeXml(text);
  // Tile stays unrotated so background-repeat tiles it with zero seams;
  // the whole (oversized) wrapper is rotated instead, so the diagonal
  // look never clips mid-glyph at a tile boundary.
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='90'>
    <text x='10' y='55' font-family='Arial, sans-serif' font-size='12' fill='#64748b' fill-opacity='0.35'>${label}</text>
  </svg>`;
  const dataUri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return (
    <div
      aria-hidden
      className="pointer-events-none hidden print:fixed print:inset-0 print:overflow-hidden print:block"
    >
      <div
        className="absolute"
        style={{
          inset: "-50%",
          width: "200%",
          height: "200%",
          transform: "rotate(-28deg)",
          backgroundImage: dataUri,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
