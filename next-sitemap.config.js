/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://mk-exports.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};

export default config;
