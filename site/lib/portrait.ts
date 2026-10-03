// The portrait crops in use, chosen by PORTRAIT_VARIANT. Cut by scripts/make-portrait-crops.mjs
// from the masters in assets/photos/ (records: assets/photos/PROVENANCE.md).
import original1x1 from "@/assets/portrait/darren-drake-original-1x1.jpg";
import original4x5 from "@/assets/portrait/darren-drake-original-4x5.jpg";
import signal1x1 from "@/assets/portrait/darren-drake-signal-1x1.jpg";
import signal4x5 from "@/assets/portrait/darren-drake-signal-4x5.jpg";
import { PORTRAIT_VARIANT } from "./site-basics";

const signal = PORTRAIT_VARIANT === "signal";
export const PORTRAIT_4X5 = signal ? signal4x5 : original4x5;
export const PORTRAIT_1X1 = signal ? signal1x1 : original1x1;
// The 4:5 file's name in assets/portrait/, for the link-preview card (read at build time).
export const PORTRAIT_4X5_NAME = `darren-drake-${PORTRAIT_VARIANT}-4x5.jpg`;
