import { Entry, Asset } from 'contentful';
import { Document } from '@contentful/rich-text-types';

// Page Skeleton
type TPageSkeleton = {
  contentTypeId: 'page';
  fields: {
    slug: {
      'en-US': string;
    };
    name: string;
    title: {
      'en-US': string;
    };
    parentPage?: Entry<TPageSkeleton>;
    seo?: Entry<TSeOSkeleton>;
    contentArea?: (Entry<THeroSkeleton> | Entry<TComponentTextSkeleton>)[];
  };
};

// Page Entry
export type TPage = Entry<TPageSkeleton>;

// Fields only (for easy access)
export type TPageFields = TPageSkeleton['fields'];

// Component: Text Skeleton
type TComponentTextSkeleton = {
  contentTypeId: 'component_text';
  fields: {
    title?: {
      'en-US': string;
    };
    text: {
      'en-US': Document;
    };
  };
};

// Component: Text Entry
export type TComponentText = Entry<TComponentTextSkeleton>;

// Fields only
export type TComponentTextFields = TComponentTextSkeleton['fields'];

// Hero Skeleton
type THeroSkeleton = {
  contentTypeId: 'hero';
  fields: {
    title?: string;
    paragraph?: string;
    media?: Asset;
  };
};

// Hero Entry
export type THero = Entry<THeroSkeleton>;

// Fields only
export type THeroFields = THeroSkeleton['fields'];

// Redirect: Page Skeleton
type TRedirectPageSkeleton = {
  contentTypeId: 'redirectPage';
  fields: {
    internalName?: string;
    type: 'redirect' | 'alias';
    page: Entry<TPageSkeleton>;
    path: {
      'en-US': string;
    };
  };
};

// Redirect: Page Entry
export type TRedirectPage = Entry<TRedirectPageSkeleton>;

// Fields only
export type TRedirectPageFields = TRedirectPageSkeleton['fields'];

// SEO Skeleton
type TSeOSkeleton = {
  contentTypeId: 'seo';
  fields: {
    name: string;
    title?: {
      'en-US': string;
    };
    description?: {
      'en-US': string;
    };
    keywords?: {
      'en-US': string[];
    };
    no_index?: boolean;
    no_follow?: boolean;
  };
};

// SEO Entry
export type TSeO = Entry<TSeOSkeleton>;

// Fields only
export type TSeOFields = TSeOSkeleton['fields'];