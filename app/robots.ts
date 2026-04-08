import { MetadataRoute } from 'next'
 
// Robots.txt file for all web application
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/',
    },
    sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  }
}