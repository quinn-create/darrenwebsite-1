import next from "eslint-config-next";

const config = [...next, { ignores: [".next/**", ".next-consent/**", "node_modules/**", "screenshots/**"] }];

export default config;
