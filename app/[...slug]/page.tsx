import Link from 'next/link';
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

async function buildBreadcrumb(page: Entry): Promise<Array<{ fullSlug: string; title: string }>> {
  const breadcrumb: Array<{ fullSlug: string; title: string }> = [];
  let currentPage: Entry | undefined = page;

  while (currentPage) {
    const fields = currentPage.fields as Record<string, unknown>;
    const title = fields.title as string || (fields.slug as string) || 'home';
    const fullSlug = await buildFullSlug(currentPage);

    // Don't add empty fullSlug (home page) to breadcrumb
    if (fullSlug) {
      breadcrumb.unshift({ fullSlug, title });
    }

    const parentPage = fields.parentPage as Entry | undefined;
    if (!parentPage || parentPage.sys.id === currentPage.sys.id) {
      break;
    }
    currentPage = parentPage;
  }

  return breadcrumb;
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

  if (!title) {
    title = slugPath === 'home' || slugPath === '' ? 'Homepage' : slugPath.split('/').pop() || 'Página';
  }

  const contentArea = Array.isArray(fields.contentArea) ? fields.contentArea : [];
  const breadcrumb = await buildBreadcrumb(page);

  return (
    <main className="min-h-screen bg-white p-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          {breadcrumb.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span>/</span>
              {index === breadcrumb.length - 1 ? (
                <span className="text-gray-900 dark:text-white font-semibold">{item.title}</span>
              ) : (
                <Link href={`/${item.fullSlug}`} className="hover:text-blue-600">
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

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