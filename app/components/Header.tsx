import Link from 'next/link';
import client from '@/lib/contentful';
import { Entry } from 'contentful';

async function buildSlugPath(page: Entry): Promise<string> {
  const fields = page.fields as Record<string, unknown>;
  const slug = fields.slug as string || 'home';
  const parentPage = fields.parentPage as Entry | undefined;

  if (!parentPage || parentPage.sys.id === page.sys.id) {
    return slug === 'home' ? '' : slug;
  }

  const parentSlugPath = await buildSlugPath(parentPage);
  return parentSlugPath ? `${parentSlugPath}/${slug}` : slug;
}

async function getAllPages() {
  const entries = await client.getEntries({
    content_type: 'page',
    limit: 1000,
  });

  const pages = [];
  for (const item of entries.items as Entry[]) {
    const fields = item.fields as Record<string, unknown>;
    const title = fields.title as string || 'Sem título';
    const slugPath = await buildSlugPath(item);

    pages.push({ id: item.sys.id, slug: slugPath, title });
  }

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function Header() {
  const pages = await getAllPages();

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            Arboretum
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-1">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={page.slug ? `/${page.slug}` : '/'}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                {page.title}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer px-3 py-2 rounded-md hover:bg-gray-700">
                ☰ Menu
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-50">
                {pages.map((page) => (
                  <Link
                    key={page.id}
                    href={page.slug ? `/${page.slug}` : '/'}
                    className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </nav>
    </header>
  );
}