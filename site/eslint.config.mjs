import next from "eslint-config-next";

const config = [...next, { ignores: [".next/**", ".next-consent/**", ".open-next/**", ".wrangler/**", "node_modules/**", "screenshots/**"] }];

export default config;
