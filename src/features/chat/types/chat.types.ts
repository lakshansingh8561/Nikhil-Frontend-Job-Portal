export type MessageType = "text" | "image" | "file";

export interface IAttachment {
  url: string;
  fileType: string;
  fileName: string;
}

export interface IRecipientProfile {
  userId: string;
  email: string;
  role: string;
  name: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  headline: string;
  companyName?: string;
}

export type MessageStatus = "sent" | "delivered" | "seen";

export interface IMessage {
  id: string;
  _id: string;
  conversationId: string;
  sender: string;
  receiver: string;
  message: string;
  messageType: MessageType;
  attachments?: IAttachment[];
  status?: MessageStatus;
  sentAt?: string;
  read: boolean;
  readAt?: string;
  seenAt?: string;
  delivered: boolean;
  deliveredAt?: string;
  replyTo?: {
    _id: string;
    message: string;
    sender: string;
    isDeleted?: boolean;
  } | null;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IConversation {
  id: string;
  _id: string;
  participants: string[];
  recruiter: string;
  jobSeeker: string;
  jobId: {
    _id: string;
    title: string;
    companyId?: string;
    location?: string;
  };
  lastMessage?: IMessage | null;
  lastMessageAt?: string;
  unreadCount: number;
  recipient: IRecipientProfile;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationPayload {
  jobId: string;
  applicantId?: string;
}

export interface SendMessagePayload {
  conversationId: string;
  message: string;
  messageType?: MessageType;
  attachments?: IAttachment[];
  replyTo?: string;
}

export interface EditMessagePayload {
  messageId: string;
  message: string;
}

export interface GetMessagesQueryParams {
  conversationId: string;
  limit?: number;
  before?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
