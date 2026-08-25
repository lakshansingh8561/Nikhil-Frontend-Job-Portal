import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  AuthorDTO,
  FeedResponse,
  PostDTO,
  CommentDTO,
  PublicProfileDTO,
  NetworkStats,
  PostMedia,
  ReactionType,
  SocialProof,
} from "../types";

const qs = (params: Record<string, string | number | undefined>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const out = search.toString();
  return out ? `?${out}` : "";
};

export const networkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- Feed & posts --------------------------------------------------------
    getFeed: builder.query<
      FeedResponse,
      { page?: number; limit?: number; tab?: "for-you" | "following" }
    >({
      query: ({ page = 1, limit = 10, tab = "for-you" }) =>
        `/posts/feed${qs({ page, limit, tab })}`,
      transformResponse: (response: any) => response?.data,
      // Merge pages so "show more" appends instead of replacing.
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.tab || "for-you"}`,
      merge: (existing, incoming, { arg }) => {
        if ((arg.page || 1) <= 1) return incoming;
        const seen = new Set(existing.posts.map((post) => post._id));
        return {
          ...incoming,
          posts: [...existing.posts, ...incoming.posts.filter((p) => !seen.has(p._id))],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page || currentArg?.tab !== previousArg?.tab,
      providesTags: ["Posts"],
    }),

    getPostById: builder.query<PostDTO, string>({
      query: (id) => `/posts/${id}`,
      transformResponse: (response: any) => response?.data,
      providesTags: (_r, _e, id) => [{ type: "Posts", id }],
    }),

    getUserPosts: builder.query<FeedResponse, { userId: string; page?: number; limit?: number }>({
      query: ({ userId, page = 1, limit = 10 }) => `/posts/user/${userId}${qs({ page, limit })}`,
      transformResponse: (response: any) => response?.data,
      providesTags: ["Posts"],
    }),

    getSavedPosts: builder.query<FeedResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/posts/saved${qs({ page, limit })}`,
      transformResponse: (response: any) => response?.data,
      providesTags: ["Posts"],
    }),

    createPost: builder.mutation<
      PostDTO,
      {
        content?: string;
        media?: PostMedia[];
        postType?: string;
        visibility?: string;
        jobId?: string;
      }
    >({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Posts"],
    }),

    updatePost: builder.mutation<
      PostDTO,
      { id: string; content?: string; visibility?: string; media?: PostMedia[] }
    >({
      query: ({ id, ...body }) => ({ url: `/posts/${id}`, method: "PATCH", body }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Posts"],
    }),

    deletePost: builder.mutation<any, string>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Posts"],
    }),

    reactToPost: builder.mutation<
      {
        postId: string;
        reactionsCount: number;
        likesCount: number;
        socialProof: SocialProof;
        myReaction: ReactionType | null;
        isLikedByMe: boolean;
      },
      { postId: string; type: ReactionType }
    >({
      query: ({ postId, type }) => ({
        url: `/posts/${postId}/reactions`,
        method: "PUT",
        body: { type },
      }),
      transformResponse: (response: any) => response?.data,
    }),

    getPostReactions: builder.query<any, string>({
      query: (postId) => `/posts/${postId}/reactions`,
      transformResponse: (response: any) => response?.data,
    }),

    repost: builder.mutation<PostDTO, { postId: string; content?: string }>({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/repost`,
        method: "POST",
        body: { content },
      }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Posts"],
    }),

    toggleSavePost: builder.mutation<{ saved: boolean }, string>({
      query: (postId) => ({ url: `/posts/${postId}/save`, method: "POST" }),
      transformResponse: (response: any) => response?.data,
    }),

    // --- Comments -----------------------------------------------------------
    getPostComments: builder.query<
      { comments: CommentDTO[]; pagination: any },
      { postId: string; page?: number; limit?: number; sort?: "recent" | "relevant" }
    >({
      query: ({ postId, page = 1, limit = 10, sort = "relevant" }) =>
        `/posts/${postId}/comments${qs({ page, limit, sort })}`,
      transformResponse: (response: any) => response?.data,
      providesTags: (_r, _e, { postId }) => [{ type: "Posts", id: `COMMENTS_${postId}` }],
    }),

    getCommentReplies: builder.query<
      { replies: CommentDTO[]; pagination: any },
      { commentId: string; page?: number; limit?: number }
    >({
      query: ({ commentId, page = 1, limit = 10 }) =>
        `/posts/comments/${commentId}/replies${qs({ page, limit })}`,
      transformResponse: (response: any) => response?.data,
    }),

    addComment: builder.mutation<
      CommentDTO,
      { postId: string; content: string; parentCommentId?: string }
    >({
      query: ({ postId, content, parentCommentId }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { content, parentCommentId },
      }),
      transformResponse: (response: any) => response?.data,
    }),

    updateComment: builder.mutation<CommentDTO, { commentId: string; content: string }>({
      query: ({ commentId, content }) => ({
        url: `/posts/comments/${commentId}`,
        method: "PATCH",
        body: { content },
      }),
      transformResponse: (response: any) => response?.data,
    }),

    deleteComment: builder.mutation<any, { commentId: string; postId: string }>({
      query: ({ commentId }) => ({ url: `/posts/comments/${commentId}`, method: "DELETE" }),
    }),

    reactToComment: builder.mutation<any, { commentId: string; type: ReactionType }>({
      query: ({ commentId, type }) => ({
        url: `/posts/comments/${commentId}/reactions`,
        method: "PUT",
        body: { type },
      }),
      transformResponse: (response: any) => response?.data,
    }),

    // --- Directory & profiles ------------------------------------------------
    searchDirectory: builder.query<
      { users: AuthorDTO[]; pagination: any },
      { query?: string; role?: string; page?: number; limit?: number }
    >({
      query: ({ query = "", role = "", page = 1, limit = 12 }) =>
        `/network/directory${qs({ query, role, page, limit })}`,
      transformResponse: (response: any) => response?.data,
      providesTags: ["Network"],
    }),

    getPublicProfile: builder.query<PublicProfileDTO, string>({
      query: (userId) => `/network/profile/${userId}`,
      transformResponse: (response: any) => response?.data,
      providesTags: (_r, _e, userId) => [{ type: "Network", id: userId }],
    }),

    getMyNetworkProfile: builder.query<PublicProfileDTO, void>({
      query: () => "/network/me/profile",
      transformResponse: (response: any) => response?.data,
      providesTags: [{ type: "Network", id: "ME" }],
    }),

    updateMyNetworkProfile: builder.mutation<PublicProfileDTO, Record<string, unknown>>({
      query: (body) => ({ url: "/network/me/profile", method: "PATCH", body }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Network", "Posts"],
    }),

    // --- Connections & invitations -------------------------------------------
    getNetworkStats: builder.query<NetworkStats, void>({
      query: () => "/network/stats",
      transformResponse: (response: any) => response?.data,
      providesTags: [{ type: "Network", id: "STATS" }],
    }),

    getSuggestions: builder.query<{ suggestions: AuthorDTO[] }, { limit?: number } | void>({
      query: (args) => `/network/suggestions${qs({ limit: args?.limit ?? 8 })}`,
      transformResponse: (response: any) => response?.data,
      providesTags: [{ type: "Network", id: "SUGGESTIONS" }],
    }),

    getReceivedInvites: builder.query<any, { page?: number; limit?: number } | void>({
      query: (args) => `/network/invitations/received${qs({ page: args?.page, limit: args?.limit })}`,
      transformResponse: (response: any) => response?.data,
      providesTags: [{ type: "Network", id: "INVITES_IN" }],
    }),

    getSentInvites: builder.query<any, { page?: number; limit?: number } | void>({
      query: (args) => `/network/invitations/sent${qs({ page: args?.page, limit: args?.limit })}`,
      transformResponse: (response: any) => response?.data,
      providesTags: [{ type: "Network", id: "INVITES_OUT" }],
    }),

    getConnections: builder.query<
      { connections: AuthorDTO[]; pagination: any },
      { query?: string; page?: number; limit?: number } | void
    >({
      query: (args) =>
        `/network/connections${qs({ query: args?.query, page: args?.page, limit: args?.limit })}`,
      transformResponse: (response: any) => response?.data,
      providesTags: [{ type: "Network", id: "CONNECTIONS" }],
    }),

    sendInvite: builder.mutation<any, { recipientId: string; message?: string }>({
      query: (body) => ({ url: "/network/invitations", method: "POST", body }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Network"],
    }),

    acceptInvite: builder.mutation<any, string>({
      query: (connectionId) => ({
        url: `/network/invitations/${connectionId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Network", "Posts"],
    }),

    ignoreInvite: builder.mutation<any, string>({
      query: (connectionId) => ({
        url: `/network/invitations/${connectionId}/ignore`,
        method: "POST",
      }),
      invalidatesTags: ["Network"],
    }),

    withdrawInvite: builder.mutation<any, string>({
      query: (connectionId) => ({
        url: `/network/invitations/${connectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Network"],
    }),

    removeConnection: builder.mutation<any, string>({
      query: (userId) => ({ url: `/network/connections/${userId}`, method: "DELETE" }),
      invalidatesTags: ["Network"],
    }),

    followUser: builder.mutation<any, string>({
      query: (userId) => ({ url: `/network/follow/${userId}`, method: "POST" }),
      invalidatesTags: ["Network"],
    }),

    unfollowUser: builder.mutation<any, string>({
      query: (userId) => ({ url: `/network/follow/${userId}`, method: "DELETE" }),
      invalidatesTags: ["Network"],
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetPostByIdQuery,
  useGetUserPostsQuery,
  useGetSavedPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useReactToPostMutation,
  useGetPostReactionsQuery,
  useRepostMutation,
  useToggleSavePostMutation,
  useGetPostCommentsQuery,
  useGetCommentRepliesQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReactToCommentMutation,
  useSearchDirectoryQuery,
  useGetPublicProfileQuery,
  useGetMyNetworkProfileQuery,
  useUpdateMyNetworkProfileMutation,
  useGetNetworkStatsQuery,
  useGetSuggestionsQuery,
  useGetReceivedInvitesQuery,
  useGetSentInvitesQuery,
  useGetConnectionsQuery,
  useSendInviteMutation,
  useAcceptInviteMutation,
  useIgnoreInviteMutation,
  useWithdrawInviteMutation,
  useRemoveConnectionMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = networkApi;
