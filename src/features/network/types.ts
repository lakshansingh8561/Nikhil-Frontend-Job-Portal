/**
 * Shapes returned by the backend network/posts endpoints.
 * Kept in one place so components never re-declare `any` for a payload.
 */

export type ReactionType = "LIKE" | "CELEBRATE" | "SUPPORT" | "LOVE" | "INSIGHTFUL" | "FUNNY";

export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";

export type PostVisibility = "ANYONE" | "CONNECTIONS";

export type ViewerConnectionState =
  | "SELF"
  | "NONE"
  | "PENDING_OUTGOING"
  | "PENDING_INCOMING"
  | "CONNECTED";

export interface PostMedia {
  url: string;
  type: MediaType;
  mimeType?: string;
  fileName?: string;
  bytes?: number;
  width?: number;
  height?: number;
  publicId?: string;
}

export interface AuthorDTO {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  coverPhoto?: string;
  headline: string;
  bio?: string;
  currentCompany: string;
  designation: string;
  experienceYears: number;
  isFresher: boolean;
  experienceLabel: string;
  location?: string;
  skills?: string[];
  joinedAt?: string;
  /** Present on directory / suggestion payloads. */
  connectionStatus?: ViewerConnectionState;
  mutualConnectionsCount?: number;
}

export interface SocialProof {
  total: number;
  breakdown: Array<{ type: ReactionType; count: number }>;
  topTypes: ReactionType[];
}

export interface JobDetails {
  _id: string;
  title: string;
  company?: string;
  location?: any;
  jobType?: string;
  salaryRange?: any;
}

export interface PostDTO {
  _id: string;
  userId: string;
  authorRole: string;
  content: string;
  media: PostMedia[];
  mediaUrls?: string[];
  postType: "GENERAL" | "HIRING" | "WORK_UPDATE";
  visibility: PostVisibility;
  author: AuthorDTO;
  jobId?: string | null;
  jobDetails?: JobDetails | null;
  reactionsCount: number;
  commentsCount: number;
  repostCount: number;
  socialProof: SocialProof;
  myReaction: ReactionType | null;
  likesCount: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  isMine: boolean;
  repostOf?: string | null;
  repostOfPost?: PostDTO | null;
  hashtags: string[];
  mentions: string[];
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedResponse {
  posts: PostDTO[];
  pagination: Pagination;
}

export interface CommentDTO {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  parentCommentId: string | null;
  repliesCount: number;
  author: AuthorDTO;
  reactionsCount: number;
  socialProof: SocialProof;
  myReaction: ReactionType | null;
  likesCount: number;
  isLikedByMe: boolean;
  isMine: boolean;
  replies: CommentDTO[];
  mentions?: string[];
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EducationEntry {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string | null;
  currentlyStudying?: boolean;
}

export interface ExperienceEntry {
  _id?: string;
  company: string;
  designation: string;
  employmentType?: string;
  startDate: string;
  endDate?: string | null;
  currentlyWorking?: boolean;
  description?: string;
}

export interface PublicProfileDTO {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  headline: string;
  bio: string;
  profilePicture: string;
  coverPhoto: string;
  skills: string[];
  location: {
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    portfolio?: string;
  };
  designation: string;
  currentCompany: string;
  department: string;
  experienceYears: number;
  isFresher: boolean;
  experienceLabel: string;
  education: EducationEntry[];
  experienceList: ExperienceEntry[];
  resumeUrl: string;
  expectedSalary?: number;
  noticePeriodDays?: number;
  postsCount: number;
  latestPosts: any[];
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
  mutualConnectionsCount: number;
  connectionStatus: ViewerConnectionState;
  isFollowing: boolean;
  isSelf: boolean;
  joinedAt: string;
}

export interface NetworkStats {
  connectionsCount: number;
  pendingInvitesCount: number;
  sentInvitesCount: number;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface InvitationDTO {
  connectionId: string;
  message: string;
  sentAt: string;
  user: AuthorDTO;
}
