export type { PaginationOpts, Paginated, AdminListOpts } from './domain/common'

export {
  AppError,
  NotFoundError,
  ConflictError,
  ForeignKeyError,
  BadRequestError,
  ValidationError,
} from './errors'

export type {
  PaginatedQuery,
  PostsQuery,
  AdminPostsQuery,
  ProjectsQuery,
  AdminProjectsQuery,
} from './http'

export type {
  PostResponse,
  PostDetailResponse,
  PostListItemResponse,
  PostListResponse,
  AdminPostListResponse,
} from './dtos/post.dto'

export type {
  ProjectResponse,
  ProjectDetailResponse,
  ProjectListResponse,
  AdminProjectListResponse,
} from './dtos/project.dto'

export type { ContactSubmissionResponse, ContactListResponse } from './dtos/contact.dto'

export type { UserResponse } from './dtos/user.dto'

export type { Expand } from './helper-types'

export type { User, UserRole, CreateUserInput, UpdateUserInput } from './domain/user'

export type { Tag, CreateTagInput, UpdateTagInput } from './domain/tag'

export type {
  Project,
  ProjectImage,
  ProjectWithTagsAndImages,
  CreateProjectInput,
  UpdateProjectInput,
} from './domain/project'

export type {
  Post,
  PostWithTags,
  PostSummary,
  CreatePostInput,
  UpdatePostInput,
} from './domain/post'

export type { ContactSubmission, CreateContactInput } from './domain/contact'

export type {
  RecommendationProvider,
  RecommendationStatus,
  RecommendationAuthor,
  Recommendation,
  RecommendationWithAuthor,
  UpsertRecommendationAuthorInput,
  CreateRecommendationInput,
} from './domain/recommendation'

export type {
  RecommendationAuthorResponse,
  RecommendationResponse,
  RecommendationListResponse,
  AdminRecommendationListResponse,
  AdminRecommendationQuery,
  CreateRecommendationBody,
  RecommendationMeResponse,
} from './dtos/recommendation.dto'

export type { AuditLog, CreateAuditLogInput } from './domain/audit-log'

export type { LlmChatLog, CreateLlmChatLogInput } from './domain/llm-chat-log'
