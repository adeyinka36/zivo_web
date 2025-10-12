export interface Media {
  id: string;
  name?: string;
  file_name?: string;
  mime_type?: string;
  url: string;
  thumbnail?: string | null;
  media_type: 'video' | 'image';
  description?: string;
  reward?: number;
  uploader_id?: string;
  uploader_username?: string;
  uploader?: {
    id: string;
    username: string;
    profile_picture?: string;
  };
  tags: (string | { id: string; name: string; slug: string; created_at: string; updated_at: string })[];
  view_count: number;
  created_at: string;
  updated_at: string;
  has_watched?: boolean;
  quiz_number?: number;
}

export interface MediaResponse {
  data: Media[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface MediaFilters {
  page?: number;
  per_page?: number;
  search?: string;
  tags?: string[];
}
