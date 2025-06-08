export interface UserProfile {
    user_id: number;
    username: string;
    avatar_url?: string;
    bio?: string;
    date_of_birth?: string;
    gender?: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    friends_count?: number;
    groups_count?: number;
    is_active?: boolean;
    website?: string;
    occupation?: string;
    interests?: string[];
    created_at?: string;
    updated_at?: string;
  }