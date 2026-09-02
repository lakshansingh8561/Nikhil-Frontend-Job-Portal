import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  Blog,
  BlogComment,
  AddCommentInput,
  BlogListResponse,
  TrendingBlogsResponse,
  BlogCategoriesResponse,
  BlogDetailResponse,
  BlogCommentsResponse,
  BlogQueryParams,
  BlogCategory,
  BlogPagination,
} from "../types/blog.types";

export const blogsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPublicBlogs: builder.query<
      { blogs: Blog[]; pagination: BlogPagination },
      BlogQueryParams | void
    >({
      query: (params) => ({
        url: "/blogs",
        params: params || {},
      }),
      transformResponse: (response: BlogListResponse) => response.data,
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ _id }) => ({ type: "Blog" as const, id: _id })),
              { type: "Blog" as const, id: "PUBLIC_LIST" },
            ]
          : [{ type: "Blog" as const, id: "PUBLIC_LIST" }],
    }),

    getTrendingBlogs: builder.query<Blog[], number | void>({
      query: (limit = 5) => ({
        url: "/blogs/trending",
        params: { limit },
      }),
      transformResponse: (response: TrendingBlogsResponse) => response.data.blogs,
      providesTags: [{ type: "Blog", id: "TRENDING_LIST" }],
    }),

    getBlogCategories: builder.query<BlogCategory[], void>({
      query: () => "/blogs/categories",
      transformResponse: (response: BlogCategoriesResponse) => response.data.categories,
      providesTags: [{ type: "Blog", id: "CATEGORIES" }],
    }),

    getBlogBySlug: builder.query<Blog, string>({
      query: (slug) => `/blogs/${slug}`,
      transformResponse: (response: BlogDetailResponse) => response.data,
      providesTags: (_result, _error, slug) => [{ type: "Blog", id: slug }],
    }),

    getMyBlogs: builder.query<
      { blogs: Blog[]; pagination: BlogPagination },
      BlogQueryParams | void
    >({
      query: (params) => ({
        url: "/blogs/my",
        params: params || {},
      }),
      transformResponse: (response: BlogListResponse) => response.data,
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ _id }) => ({ type: "Blog" as const, id: _id })),
              { type: "Blog" as const, id: "MY_LIST" },
            ]
          : [{ type: "Blog" as const, id: "MY_LIST" }],
    }),

    getAdminBlogs: builder.query<
      { blogs: Blog[]; pagination: BlogPagination },
      BlogQueryParams | void
    >({
      query: (params) => ({
        url: "/blogs/admin/all",
        params: params || {},
      }),
      transformResponse: (response: BlogListResponse) => response.data,
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ _id }) => ({ type: "Blog" as const, id: _id })),
              { type: "Blog" as const, id: "ADMIN_LIST" },
            ]
          : [{ type: "Blog" as const, id: "ADMIN_LIST" }],
    }),

    createBlog: builder.mutation<Blog, FormData>({
      query: (formData) => ({
        url: "/blogs",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: BlogDetailResponse) => response.data,
      invalidatesTags: [
        { type: "Blog", id: "PUBLIC_LIST" },
        { type: "Blog", id: "MY_LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "TRENDING_LIST" },
        { type: "Blog", id: "CATEGORIES" },
      ],
    }),

    updateBlog: builder.mutation<Blog, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response: BlogDetailResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "PUBLIC_LIST" },
        { type: "Blog", id: "MY_LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "TRENDING_LIST" },
      ],
    }),

    deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Blog", id: "PUBLIC_LIST" },
        { type: "Blog", id: "MY_LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "TRENDING_LIST" },
        { type: "Blog", id: "CATEGORIES" },
      ],
    }),

    publishBlog: builder.mutation<Blog, string>({
      query: (id) => ({
        url: `/blogs/${id}/publish`,
        method: "PATCH",
      }),
      transformResponse: (response: BlogDetailResponse) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "Blog", id },
        { type: "Blog", id: "PUBLIC_LIST" },
        { type: "Blog", id: "MY_LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "TRENDING_LIST" },
      ],
    }),

    unpublishBlog: builder.mutation<Blog, string>({
      query: (id) => ({
        url: `/blogs/${id}/unpublish`,
        method: "PATCH",
      }),
      transformResponse: (response: BlogDetailResponse) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "Blog", id },
        { type: "Blog", id: "PUBLIC_LIST" },
        { type: "Blog", id: "MY_LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "TRENDING_LIST" },
      ],
    }),

    uploadBlogMedia: builder.mutation<
      { url: string; public_id: string; fileName: string; fileType: string; fileSize: number },
      FormData
    >({
      query: (formData) => ({
        url: "/blogs/upload-media",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: any) => response.data,
    }),

    // ================= COMMENT ENDPOINTS =================
    getBlogComments: builder.query<BlogComment[], string>({
      query: (blogId) => `/blogs/${blogId}/comments`,
      transformResponse: (response: BlogCommentsResponse) => response.data.comments,
      providesTags: (_result, _error, blogId) => [{ type: "Blog", id: `COMMENTS_${blogId}` }],
    }),

    addBlogComment: builder.mutation<BlogComment, AddCommentInput>({
      query: ({ blogId, content, name, email }) => ({
        url: `/blogs/${blogId}/comments`,
        method: "POST",
        body: { content, name, email },
      }),
      invalidatesTags: (_result, _error, { blogId }) => [
        { type: "Blog", id: `COMMENTS_${blogId}` },
        { type: "Blog", id: blogId },
      ],
    }),

    deleteBlogComment: builder.mutation<{ success: boolean }, { commentId: string; blogId: string }>({
      query: ({ commentId }) => ({
        url: `/blogs/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { blogId }) => [
        { type: "Blog", id: `COMMENTS_${blogId}` },
        { type: "Blog", id: blogId },
      ],
    }),
  }),
});

export const {
  useGetPublicBlogsQuery,
  useGetTrendingBlogsQuery,
  useGetBlogCategoriesQuery,
  useGetBlogBySlugQuery,
  useGetMyBlogsQuery,
  useGetAdminBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useUnpublishBlogMutation,
  useUploadBlogMediaMutation,
  useGetBlogCommentsQuery,
  useAddBlogCommentMutation,
  useDeleteBlogCommentMutation,
} = blogsApi;
