import { useEffect } from 'react';
import RoyalMaroon from '../templates/royal-maroon-01/Template';
import ModernFloral from '../templates/modern-floral-02/Template';
import ClassicGold from '../templates/classic-gold-03/Template';

interface Props {
  data: {
    slug: string;
    templateId: string;
    data: any;
  };
}

const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'royal-maroon-01': RoyalMaroon,
  'modern-floral-02': ModernFloral,
  'classic-gold-03': ClassicGold,
};

export default function PublishedSite({ data }: Props) {
  const TemplateComponent = TEMPLATE_COMPONENTS[data.templateId] || RoyalMaroon;

  useEffect(() => {
    // Log page view
    console.log('Site viewed:', data.slug);
  }, [data.slug]);

  return <TemplateComponent data={data.data} />;
}
