import { Entry, Asset } from 'contentful';

interface HeroProps {
  item: Entry;
}

export function Hero({ item }: HeroProps) {
  const fields = item.fields as Record<string, unknown>;

  const title = fields.title as string | undefined;
  const paragraph = fields.paragraph as string | undefined;
  const media = fields.media as Asset | undefined;

  return (
    <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-lg overflow-hidden">
      {/* Background Image se existir */}
      {media && media.fields?.file?.url && (
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(https:${media.fields.file.url})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-12 text-white">
        {title && (
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
        )}

        {paragraph && (
          <p className="text-lg leading-relaxed max-w-2xl">{paragraph}</p>
        )}

        {!title && !paragraph && (
          <p className="text-gray-200">Hero sem conteúdo</p>
        )}
      </div>
    </div>
  );
}
