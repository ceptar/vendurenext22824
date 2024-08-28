const commerce = require('./commerce.config.json')
const { withCommerceConfig, getProviderName } = require('./commerce-config')

const provider = commerce.provider || getProviderName()
const isBC = provider === '@vercel/commerce-bigcommerce'
const isShopify = provider === '@vercel/commerce-shopify'
const isSaleor = provider === '@vercel/commerce-saleor'
const isSwell = provider === '@vercel/commerce-swell'
const isVendure = provider === '@vercel/commerce-vendure'

module.exports = withCommerceConfig({
  swcMinify: true,
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  commerce,
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  images: {
    domains: ['https://discobabes.store','http://127.0.0.1:8000','https://l162c2b9-8000.euw.devtunnels.ms','http://212.132.115.241:8000'],
    unoptimized: true,
  },
  rewrites() {
    return [
      (isBC || isShopify || isSwell || isVendure || isSaleor) && {
        source: '/checkout',
        destination: '/api/commerce/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/logout?redirect_to=/',
      },
      // For Vendure, rewrite the local api url to the remote (external) api url. This is required
      // to make the session cookies work.
      isVendure &&
        process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL && {
          source: `${process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL}/:path*`,
          destination: `${process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL}/:path*`,
        },
    ].filter(Boolean)
  },

  // Avoid Module not found: ESM packages (supports-color) need to be imported. Use 'import' to reference the package instead. https://nextjs.org/docs/messages/import-esm-externals
  experimental: {
    esmExternals: 'loose',
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
