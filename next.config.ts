import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://ruactkienbzjgdnvxsnf.supabase.co/storage/v1/object/public/profile-picture/**"
      ),
    ],
  },
};

export default nextConfig;
