const API_BASE_URL = "https://tpbackend.abuhammad.online/api/app/prompts";

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Prompt {
  id: number;
  title: string;
  prompt_text: string;
  image_url: string;
  category_id: number;
  views_count: number;
  likes_count: number;
  copy_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface PaginatedResponse {
  current_page: number;
  data: Prompt[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const result: ApiResponse<Category[]> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

// Fetch prompts with pagination
export const fetchPrompts = async (page: number = 1, perPage: number = 21): Promise<PaginatedResponse> => {
  const response = await fetch(`${API_BASE_URL}/list?page=${page}&per_page=${perPage}`);
  const result: ApiResponse<PaginatedResponse> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

// Fetch single prompt
export const fetchPrompt = async (id: number): Promise<Prompt> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const result: ApiResponse<Prompt> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

// Fetch featured prompts
export const fetchFeaturedPrompts = async (): Promise<Prompt[]> => {
  const response = await fetch(`${API_BASE_URL}/featured`);
  const result: ApiResponse<{ data: Prompt[] }> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data.data;
};

// Like a prompt
export const likePrompt = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
};

// Copy a prompt (track copy action)
export const copyPrompt = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}/copy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
};
