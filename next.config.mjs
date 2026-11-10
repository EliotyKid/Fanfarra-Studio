/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // `next dev` blocks other devices by default; this machine's LAN IP, so phones can open the dev server.
  // shortcut: fixed IP, update it if the router assigns a new one
  allowedDevOrigins: ['10.10.11.13'],
}

export default nextConfig
