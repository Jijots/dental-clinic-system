function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function PrintWatermark({ text }: { text: string }) {
  const label = escapeXml(text);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='150'>
    <text x='-20' y='90' transform='rotate(-28 140 75)' font-family='Arial, sans-serif' font-size='12' fill='#64748b' fill-opacity='0.4'>${label}</text>
  </svg>`;
  const dataUri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return (
    <div
      aria-hidden
      className="pointer-events-none hidden print:fixed print:inset-0 print:block"
      style={{ backgroundImage: dataUri, backgroundRepeat: "repeat" }}
    />
  );
}
