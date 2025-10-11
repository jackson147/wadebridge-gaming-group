/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { env } from "./src/env.js";

// Extract hostname from the full MinIO endpoint URL
const minioHostname = new URL(env.MINIO_ENDPOINT).hostname;

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: minioHostname,
            },
        ],
    },
};

export default config;
