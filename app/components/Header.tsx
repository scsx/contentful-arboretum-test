import Link from 'next/link';
import client from '@/lib/contentful';
import { Entry } from 'contentful';

interface MenuItem {
  id: string;
  slug: string;
  title: string;
  children?: MenuItem[];
}

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

async function getAllPages(): Promise<MenuItem[]> {
  const entries = await client.getEntries({
    content_type: 'page',
    limit: 1000,
  });

  const pagesMap: Map<string, MenuItem> = new Map();
  let homePage: Entry | undefined;

  // First pass: create all menu items and find Home
  for (const item of entries.items as Entry[]) {
    const fields = item.fields as Record<string, unknown>;
    const title = fields.title as string || 'Sem título';
    const slugPath = await buildSlugPath(item);

    pagesMap.set(item.sys.id, { id: item.sys.id, slug: slugPath, title });

    // Find Home page (empty slug or slug is "home")
    if (slugPath === '' || slugPath === 'home') {
      homePage = item;
    }
  }

  // Function to recursively build children
  function buildChildren(itemId: string): MenuItem[] {
    const children: MenuItem[] = [];
    for (const item of entries.items as Entry[]) {
      const fields = item.fields as Record<string, unknown>;
      const parentPage = fields.parentPage as Entry | undefined;

      if (parentPage?.sys.id === itemId) {
        const menuItem = pagesMap.get(item.sys.id);
        if (menuItem) {
          const nestedChildren = buildChildren(item.sys.id);
          if (nestedChildren.length > 0) {
            menuItem.children = nestedChildren;
          }
          children.push(menuItem);
        }
      }
    }
    return children.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  // Get top-level items: direct children of Home
  if (homePage) {
    const topLevel = buildChildren(homePage.sys.id);
    return topLevel;
  }

  return [];
}

// Recursive component para renderizar submenus
function MenuSubmenu({ items }: { items: MenuItem[] | undefined }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.id}>
          <Link
            href={item.slug ? `/${item.slug}` : '/'}
            className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
          >
            {item.title}
          </Link>
          {item.children && item.children.length > 0 && (
            <div className="pl-4 border-l border-gray-600">
              <MenuSubmenu items={item.children} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
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

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-1">
            {pages.map((page) => (
              <div key={page.id} className="relative group">
                <Link
                  href={page.slug ? `/${page.slug}` : '/'}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  {page.title}
                </Link>

                {/* Submenu com todos os filhos recursivos */}
                {page.children && page.children.length > 0 && (
                  <div className="absolute left-0 mt-0 w-64 bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                    <MenuSubmenu items={page.children} />
                  </div>
                )}
              </div>
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