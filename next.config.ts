import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    rewrites: async () => {
        return [
            
            {
                source: "/relay-iljT/static/:path*",
                destination: "https://eu-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/relay-iljT/:path*",
                destination: "https://eu.i.posthog.com/:path*",
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                hostname: "*.googleusercontent.com",
            },
        ],
    },
    skipTrailingSlashRedirect: true,
}

export default nextConfig
