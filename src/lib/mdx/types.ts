export interface BlogMetadata {
  title: string;
  slug: string;
  publishedAt: string;
  categories: string[];
  coverImage: string;
  coverImageAlt: string;
  author: {
    name: string;
    avatar: string;
  };
  excerpt?: string;
}

export interface BlogPost {
  metadata: BlogMetadata;
  slug: string;
  readingTime: string;
}
