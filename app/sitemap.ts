import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://myweekendatlas.com";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/suggest`, lastModified: new Date() },
  ];
}
