import Link from 'next/link';
import { Entry } from 'contentful';
import { ContentRenderer } from '@/app/components/ContentRenderer';
import { buildFullSlug, getPageByFullSlug, buildBreadcrumb } from '@/lib/page';

interface PageParams {
  slug?: string[];
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