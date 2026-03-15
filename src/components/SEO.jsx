import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, article }) {
  const siteName = 'nullptr';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = 'Dissecting the internals of modern software engineering. High-density technical deep dives.';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
