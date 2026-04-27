import { Entry } from 'contentful';
import { ContentRenderer } from './components/ContentRenderer';
import { getPageByFullSlug } from '@/lib/page';

export default async function Home() {
  const page = await getPageByFullSlug('');

  if (!page) {
    return (
      <main className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold">Página não encontrada</h1>
      </main>
    );
  }

  const fields = page.fields as Record<string, unknown>;
  const title = fields.title as string || 'Homepage';

  const contentArea = Array.isArray(fields.contentArea)
    ? fields.contentArea
    : [];

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
        {title}
      </h1>

      {contentArea.length > 0 && (
        <div className="space-y-8">
          {contentArea.map((item: Entry) => (
            <ContentRenderer key={item.sys.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}