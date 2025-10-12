import { ApiClient } from '../api/ApiClient';
import { Media, MediaResponse, MediaFilters } from '../../types/media';

export class MediaService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async getMedia(filters: MediaFilters = {}): Promise<MediaResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => params.append('tags[]', tag));
    }

    const response = await this.apiClient.get<MediaResponse>(`/media?${params.toString()}`);
    return response.data;
  }

  async getMediaById(id: string): Promise<Media> {
    const response = await this.apiClient.get<{ data: Media }>(`/media/${id}`);
    return response.data.data;
  }

  async markAsWatched(mediaId: string, userId: string): Promise<any> {
    const response = await this.apiClient.post(`/media-watched/${mediaId}/${userId}`);
    return response.data;
  }

  async submitQuizResult(data: { is_correct: boolean; media_id: string }): Promise<any> {
    const response = await this.apiClient.post('/quiz/result', data);
    return response.data;
  }
}

export const mediaService = new MediaService();
