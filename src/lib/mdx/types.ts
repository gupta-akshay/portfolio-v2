export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  metadata: import('./schema').BlogMetadata;
  slug: string;
  readingTime: string;
}
