import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "100vw": "100vw",
        "50vw": "50vw",
        "25vw": "25vw",
      },
    },
  },
  plugins: [require("tailwindcss-3d")],
}
export default config
