import client from '@/lib/contentful';
import { Entry } from 'contentful';

export async function buildFullSlug(page: Entry): Promise<string> {
  const fields = page.fields as Record<string, unknown>;
  const slug = fields.slug as string || 'home';
  const parentPage = fields.parentPage as Entry | undefined;

  if (!parentPage || parentPage.sys.id === page.sys.id) {
    return slug === 'home' ? '' : slug;
  }

  const parentSlug = await buildFullSlug(parentPage);
  return parentSlug ? `${parentSlug}/${slug}` : slug;
}

export async function getPageByFullSlug(fullSlug: string) {
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

export async function buildBreadcrumb(page: Entry): Promise<Array<{ fullSlug: string; title: string }>> {
  const breadcrumb: Array<{ fullSlug: string; title: string }> = [];
  let currentPage: Entry | undefined = page;

  while (currentPage) {
    const fields = currentPage.fields as Record<string, unknown>;
    const title = fields.title as string || (fields.slug as string) || 'home';
    const fullSlug = await buildFullSlug(currentPage);

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