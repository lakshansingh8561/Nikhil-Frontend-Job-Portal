import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  IConversation,
  IMessage,
  CreateConversationPayload,
  SendMessagePayload,
  EditMessagePayload,
  GetMessagesQueryParams,
  ApiResponse,
} from "../types/chat.types";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserConversations: builder.query<IConversation[], void>({
      query: () => "/chat/conversations",
      transformResponse: (response: ApiResponse<IConversation[]>) =>
        response.data,
      providesTags: ["Chat"],
    }),

    getConversationById: builder.query<IConversation, string>({
      query: (id) => `/chat/conversations/${id}`,
      transformResponse: (response: ApiResponse<IConversation>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Chat", id }],
    }),

    getMessages: builder.query<
      { messages: IMessage[]; hasMore: boolean },
      GetMessagesQueryParams
    >({
      query: ({ conversationId, limit = 30, before }) => {
        let url = `/chat/conversations/${conversationId}/messages?limit=${limit}`;
        if (before) url += `&before=${encodeURIComponent(before)}`;
        return url;
      },
      transformResponse: (
        response: ApiResponse<{ messages: IMessage[]; hasMore: boolean }>
      ) => response.data,
      providesTags: (_result, _error, { conversationId }) => [
        { type: "Chat", id: `MESSAGES_${conversationId}` },
      ],
    }),

    createOrGetConversation: builder.mutation<
      IConversation,
      CreateConversationPayload
    >({
      query: (body) => ({
        url: "/chat/conversations",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<IConversation>) =>
        response.data,
      invalidatesTags: ["Chat"],
    }),

    sendMessage: builder.mutation<IMessage, SendMessagePayload>({
      query: ({ conversationId, ...body }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<IMessage>) => response.data,
      invalidatesTags: (_result, _error, { conversationId }) => [
        "Chat",
        { type: "Chat", id: conversationId },
        { type: "Chat", id: `MESSAGES_${conversationId}` },
      ],
    }),

    editMessage: builder.mutation<IMessage, EditMessagePayload>({
      query: ({ messageId, message }) => ({
        url: `/chat/messages/${messageId}`,
        method: "PATCH",
        body: { message },
      }),
      transformResponse: (response: ApiResponse<IMessage>) => response.data,
      invalidatesTags: ["Chat"],
    }),

    deleteMessage: builder.mutation<IMessage, string>({
      query: (messageId) => ({
        url: `/chat/messages/${messageId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<IMessage>) => response.data,
      invalidatesTags: ["Chat"],
    }),

    markAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),

    getUnreadCount: builder.query<{ unreadCount: number }, void>({
      query: () => "/chat/unread-count",
      transformResponse: (response: ApiResponse<{ unreadCount: number }>) =>
        response.data,
      providesTags: ["Chat"],
    }),

    searchMessages: builder.query<
      IMessage[],
      { conversationId: string; query: string }
    >({
      query: ({ conversationId, query }) =>
        `/chat/conversations/${conversationId}/messages/search?query=${encodeURIComponent(
          query
        )}`,
      transformResponse: (response: ApiResponse<IMessage[]>) => response.data,
    }),
  }),
});

export const {
  useGetUserConversationsQuery,
  useGetConversationByIdQuery,
  useGetMessagesQuery,
  useCreateOrGetConversationMutation,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useMarkAsReadMutation,
  useGetUnreadCountQuery,
  useLazySearchMessagesQuery,
} = chatApi;
