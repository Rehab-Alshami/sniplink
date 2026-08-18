/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Next.js blocks cross-origin requests to dev-only assets/endpoints by
  // default in dev mode — only `localhost` is trusted out of the box. When
  // testing on a phone over the LAN (e.g. http://192.168.0.220:3000), the
  // dev server's own JS chunks can get silently blocked for that origin, so
  // the page renders (SSR HTML looks fine) but React never hydrates and
  // *no* button responds to any input — this looks like a touch-specific
  // bug but isn't; it would fail identically with a mouse on that same URL.
  // Add every LAN IP this machine has advertised so far; update/extend if
  // DHCP reassigns a new one. Only applies in development.
  allowedDevOrigins: ["192.168.0.220", "192.168.25.1", "192.168.207.1"],
}

export default nextConfig
