interface IAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image?: string;
  cover_image?: string;
  bio?: string;
  website?: string;
  location?: string;
  facebook?: string;
  twitter?: string;
  meta_title?: string;
  meta_description?: string;
  url: string;
}

export interface IPosts {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  comment_id: string;
  feature_image: string;
  featured: boolean;
  visibility: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  custom_excerpt?: string;
  codeinjection_head?: string;
  codeinjection_foot?: string;
  custom_template?: string;
  canonical_url?: string;
  authors: Array<IAuthor>;
  tags: Array<string>;
  primary_author: Array<IAuthor>;
  primary_tag?: string;
  url: string;
  excerpt: string;
  reading_time: number;
  access: boolean;
  comments: boolean;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  meta_title?: string;
  meta_description?: string;
  email_subject?: string;
  frontmatter?: string;
  feature_image_alt?: string;
  feature_image_caption?: string;
}

export interface IPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  comment_id: string;
  feature_image: string;
  featured: boolean;
  visibility: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  custom_excerpt: null;
  codeinjection_head: string | null;
  codeinjection_foot: string | null;
  custom_template: string | null;
  canonical_url: string | null;
  url: string;
  excerpt: string;
  reading_time: number;
  access: boolean;
  comments: boolean;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  email_subject: string | null;
  frontmatter: string | null;
  feature_image_alt: string | null;
  feature_image_caption: string | null;
}

export interface IPagination {
  page: number;
  limit: number;
  pages: number;
  total: number;
}

export interface IPage {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  comment_id: string;
  feature_image: string;
  featured: boolean;
  visibility: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  custom_excerpt: string;
  codeinjection_head: string;
  codeinjection_foot: string;
  custom_template: string;
  canonical_url: string;
  show_title_and_feature_image: boolean;
  url: string;
  excerpt: string;
  reading_time: number;
  access: boolean;
  comments: boolean;
  og_image: string;
  og_title: string;
  og_description: string;
  twitter_image: string;
  twitter_title: string;
  twitter_description: string;
  meta_title: string;
  meta_description: string;
  frontmatter: string;
  feature_image_alt: string;
  feature_image_caption: string;
}

export type TTags =
  | "all"
  | "market-updates"
  | "blog"
  | "top-tips"
  | "company-updates";

export const Tags: Record<string, TTags> = {
  All: "all",
  "Market Updates": "market-updates",
  Blog: "blog",
  "Top Tips": "top-tips",
  "Company Updates": "company-updates",
};
