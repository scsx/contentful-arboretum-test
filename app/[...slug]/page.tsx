import client from '@/lib/contentful';
import { Entry } from 'contentful';
import { ContentRenderer } from '@/app/components/ContentRenderer';

interface PageParams {
  slug?: string[];
}

async function buildFullSlug(page: Entry): Promise<string> {
  const fields = page.fields as Record<string, unknown>;
  const slug = fields.slug as string || 'home';
  const parentPage = fields.parentPage as Entry | undefined;

  if (!parentPage || parentPage.sys.id === page.sys.id) {
    return slug === 'home' ? '' : slug;
  }

  const parentSlug = await buildFullSlug(parentPage);
  return parentSlug ? `${parentSlug}/${slug}` : slug;
}

async function getPageByFullSlug(fullSlug: string) {
  const normalizedSlug = fullSlug === 'home' ? '' : fullSlug;

  const entries = await client.getEntries({
    content_type: 'page',
    limit: 1000,
  });

  for (const item of entries.items as Entry[]) {
    const builtSlug = await buildFullSlug(item);
    if (builtSlug === normalizedSlug) {
      return item;
    }
  }

  return null;
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug?.join('/') || 'home';
  const page = await getPageByFullSlug(slugPath);

  if (!page) {
    return (
      <main className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold">Página não encontrada</h1>
      </main>
    );
  }

  const fields = page.fields as Record<string, unknown>;
  let title = fields.title as string;

  // Se title vazio, usa nome do slug ou "Homepage"
  if (!title) {
    title = slugPath === 'home' || slugPath === '' ? 'Homepage' : slugPath.split('/').pop() || 'Página';
  }

  const contentArea = Array.isArray(fields.contentArea) ? fields.contentArea : [];

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