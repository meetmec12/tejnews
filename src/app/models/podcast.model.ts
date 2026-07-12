export interface Podcast {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  link: string;
  media_type?: 'audio' | 'video';
  media_url?: string;
  duration?: string;
  episode_number?: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}
