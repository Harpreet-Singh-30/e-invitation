import { useEffect } from 'react';
import { resolveTemplate } from '../templates/registry';

interface Props {
  data: {
    slug: string;
    templateId: string;
    data: any;
  };
}

export default function PublishedSite({ data }: Props) {
  const resolved = resolveTemplate(data.templateId || data.slug) || resolveTemplate('royal-maroon');
  const TemplateComponent = resolved!.component;

  useEffect(() => {
    // Log page view
    console.log('Site viewed:', data.slug);
  }, [data.slug]);

  return <TemplateComponent data={data.data} />;
}
