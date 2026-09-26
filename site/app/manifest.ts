import type { MetadataRoute } from "next";
import { FIRM } from "@/lib/site";

// Served at /manifest.webmanifest. Home-screen name and icons (scripts/make-icons.mjs).
// display "browser": saving to the home screen opens the normal website, not an app window.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: FIRM.legalName,
    short_name: FIRM.name,
    description: `${FIRM.name}, ${FIRM.descriptor}, Murfreesboro, Tennessee.`,
    start_url: "/",
    display: "browser",
    background_color: "#090F1C",
    theme_color: "#090F1C",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
