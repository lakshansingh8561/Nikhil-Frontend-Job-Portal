export interface BlogCoverImage {
  url: string;
  publicId: string;
}

export interface BlogAuthorDetails {
  _id: string;
  email: string;
  role: string;
  name: string;
  profilePicture: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: BlogCoverImage;
  category: string;
  tags: string[];
  author: string | BlogAuthorDetails;
  authorRole: "JOB_SEEKER" | "RECRUITER" | "ADMIN";
  status: "draft" | "published";
  views: number;
  uniqueViews: number;
  commentsCount?: number;
  readTime: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorDetails?: BlogAuthorDetails;
  trendingScore?: number;
}

export interface BlogComment {
  _id: string;
  blog: string;
  user?: string;
  name: string;
  email: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface AddCommentInput {
  blogId: string;
  content: string;
  name?: string;
  email?: string;
}

export interface BlogCategory {
  name: string;
  count: number;
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogListResponse {
  success: boolean;
  message: string;
  data: {
    blogs: Blog[];
    pagination: BlogPagination;
  };
}

export interface TrendingBlogsResponse {
  success: boolean;
  message: string;
  data: {
    blogs: Blog[];
  };
}

export interface BlogCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    categories: BlogCategory[];
  };
}

export interface BlogDetailResponse {
  success: boolean;
  message: string;
  data: Blog;
}

export interface BlogCommentsResponse {
  success: boolean;
  message: string;
  data: {
    comments: BlogComment[];
  };
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  status?: "draft" | "published";
  sort?: "latest" | "views" | "trending";
  role?: string;
  authorId?: string;
}

export interface CreateBlogInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  status?: "draft" | "published";
  coverImage?: File;
}

export interface UpdateBlogInput {
  id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  status?: "draft" | "published";
  coverImage?: File;
}
