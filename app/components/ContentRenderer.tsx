import { Entry } from 'contentful';
import { Hero } from './Hero';
import { TextComponent } from './TextComponent';

interface ContentRendererProps {
  item: Entry;
}

export function ContentRenderer({ item }: ContentRendererProps) {
  const contentTypeId = item.sys.contentType.sys.id;

  return (
    <div className="mb-6">
      {contentTypeId === 'hero' && <Hero item={item} />}
      {contentTypeId === 'component_text' && <TextComponent item={item} />}
    </div>
  );
}
