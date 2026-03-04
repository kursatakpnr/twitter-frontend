/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Surface Layers (deep → lighter) ── */
        night:       "#0b1120",
        surface:     "#111a2e",
        raised:      "#182236",
        overlay:     "#1f2b40",

        /* ── Borders ── */
        edge:        "#243352",
        "edge-hover":"#2e4068",

        /* ── Typography ── */
        heading:     "#f0f4f8",
        body:        "#b0bec5",
        subtle:      "#6f8294",

        /* ── Brand (warm gold) ── */
        brand:       "#e8a849",
        "brand-hover":"#f0ba6a",

        /* ── Feedback ── */
        ok:          "#4ade80",
        err:         "#fb7185",
      },
      boxShadow: {
        soft:  "0 8px 32px rgba(11,17,32,0.5)",
        glow:  "0 0 24px rgba(232,168,73,0.10)",
        card:  "0 2px 12px rgba(11,17,32,0.35)",
      },
      fontFamily: {
        display: ['"Sora"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: []
};
