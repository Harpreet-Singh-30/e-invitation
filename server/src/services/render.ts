import db from '../db';

interface SiteData {
  slug: string;
  templateId: string;
  data: any;
  isOnline: boolean;
}

interface OpenGraphTags {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * Get site data by slug
 */
export function getSiteBySlug(slug: string): SiteData | null {
  try {
    const site = db.prepare(`
      SELECT s.slug, s.template_id as templateId, s.data_json, s.is_online as isOnline
      FROM sites s
      WHERE s.slug = ? AND s.is_online = 1
    `).get(slug) as any;
    
    if (!site) {
      return null;
    }
    
    return {
      slug: site.slug,
      templateId: site.templateId,
      data: JSON.parse(site.data_json),
      isOnline: !!site.isOnline
    };
  } catch (error) {
    console.error('Error fetching site:', error);
    return null;
  }
}

/**
 * Generate Open Graph tags for a site
 */
export function generateOGTags(site: SiteData, baseUrl: string): OpenGraphTags {
  const { data } = site;
  
  const groomName = data.couple?.groom || 'Groom';
  const brideName = data.couple?.bride || 'Bride';
  const tagline = data.couple?.tagline || 'Join us in celebrating our union';
  
  const title = `${groomName} & ${brideName} - Wedding Invitation`;
  const description = tagline;
  
  // Use first gallery image or template poster
  let image = `${baseUrl}/assets/default-og-image.jpg`;
  if (data.gallery && data.gallery.length > 0) {
    image = `${baseUrl}/uploads/${data.gallery[0]}`;
  }
  
  const url = `${baseUrl}`;
  
  return { title, description, image, url };
}

/**
 * Inject Open Graph tags and site data into HTML shell
 */
export function renderHTMLWithOGTags(
  htmlTemplate: string,
  ogTags: OpenGraphTags,
  siteData: any
): string {
  const ogMetaTags = `
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(ogTags.title)}">
    <meta property="og:description" content="${escapeHtml(ogTags.description)}">
    <meta property="og:image" content="${escapeHtml(ogTags.image)}">
    <meta property="og:url" content="${escapeHtml(ogTags.url)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(ogTags.title)}">
    <meta name="twitter:description" content="${escapeHtml(ogTags.description)}">
    <meta name="twitter:image" content="${escapeHtml(ogTags.image)}">
    <title>${escapeHtml(ogTags.title)}</title>
  `;
  
  // Inject OG tags into <head>
  let html = htmlTemplate.replace('</head>', `${ogMetaTags}</head>`);
  
  // Inject site data as JSON for the React app
  const siteDataScript = `
    <script>
      window.__SITE_DATA__ = ${JSON.stringify(siteData)};
    </script>
  `;
  
  html = html.replace('</body>', `${siteDataScript}</body>`);
  
  return html;
}

/**
 * Render HTML for landing page or editor
 */
export function renderAppHTML(htmlTemplate: string, pageData?: any): string {
  if (!pageData) {
    return htmlTemplate;
  }
  
  const dataScript = `
    <script>
      window.__PAGE_DATA__ = ${JSON.stringify(pageData)};
    </script>
  `;
  
  return htmlTemplate.replace('</body>', `${dataScript}</body>`);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, m => map[m]);
}

export default {
  getSiteBySlug,
  generateOGTags,
  renderHTMLWithOGTags,
  renderAppHTML
};
