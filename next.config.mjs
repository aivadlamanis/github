/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The knowledge base is read from disk at request time, so make sure the
  // files are bundled into the serverless function on Vercel.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/kb/**/*"],
  },
};

export default nextConfig;
