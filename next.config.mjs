/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/wai852/blogposts/main/images/**",
      },
    ],
  },
};

export default nextConfig;
