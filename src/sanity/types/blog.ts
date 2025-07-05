import { PortableTextBlock } from 'sanity';

export type Slug = {
  _type: 'slug';
  current: string;
};

export type Category = {
  title: string;
  slug: Slug;
};

export type ImageAsset = {
  _ref: string;
  _type: 'reference';
};

export type Image = {
  _type: 'image';
  asset: ImageAsset;
  alt?: string;
};

export type Author = {
  name: string;
  image: Image;
  bio: PortableTextBlock[];
  slug: Slug;
  _id: string;
};

export type Blog = {
  _id: string;
  title: string;
  slug: Slug;
  categories: Category[];
  author: Author;
  mainImage: Image;
  publishedAt: string;
  body: PortableTextBlock[];
  excerpt?: string;
};
