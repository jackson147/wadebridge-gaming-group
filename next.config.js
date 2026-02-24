import version from './package.json' with { type: 'json' };
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 *
 * @type {import("next").NextConfig}
 */

const config = {
    output: "standalone",
    env: {
        NEXT_PUBLIC_PACKAGE_VERSION: version.version,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.newlinkedlist.com",
            },
            {
                protocol: "https",
                hostname: "**.wadebridgegames.com",
            },
        ],
    },
};

export default config;

// The `@t3-oss/env-nextjs` is still important for runtime validation
// and type safety in your application code. We just don't want to
// import it in the Next.js config file.
// We can import it in our layout or page files to ensure validation
// runs early in the application lifecycle.
// import "./src/env.js";
