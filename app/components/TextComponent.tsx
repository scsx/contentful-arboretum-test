import { Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface TextComponentProps {
  readonly item: Entry;
}

export function TextComponent({ item }: TextComponentProps) {
  const fields = item.fields as Record<string, unknown>;

  const title = typeof fields.title === 'string'
    ? fields.title
    : typeof fields.title === 'object'
    ? (fields.title as Record<string, string>)['en-US']
    : undefined;

  const text = fields.text as Document | undefined;

  return (
    <article className="prose prose-sm max-w-none bg-white p-8 rounded-lg shadow-sm">
      {title && (
        <h3 className="text-2xl font-bold mb-6 text-gray-900">{title}</h3>
      )}

      {text ? (
        <div className="text-gray-700 leading-relaxed">
          {documentToReactComponents(text)}
        </div>
      ) : (
        <p className="text-gray-400">Sem conteúdo</p>
      )}
    </article>
  );
}