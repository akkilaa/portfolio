export type {
  PaginationOpts,
  Paginated,
  AdminListOpts,
} from "@shared/domain/common";

export type { Expand } from "@shared/helper-types";

export type {
  User,
  UserRole,
  CreateUserInput,
  UpdateUserInput,
} from "@shared/domain/user";

export type { Tag, CreateTagInput, UpdateTagInput } from "@shared/domain/tag";

export type {
  Project,
  ProjectImage,
  ProjectWithTagsAndImages,
  CreateProjectInput,
  UpdateProjectInput,
} from "@shared/domain/project";

export type {
  Post,
  PostWithTags,
  PostSummary,
  CreatePostInput,
  UpdatePostInput,
} from "@shared/domain/post";

export type {
  ContactSubmission,
  CreateContactInput,
} from "@shared/domain/contact";

export type {
  RecommendationProvider,
  RecommendationStatus,
  RecommendationAuthor,
  Recommendation,
  RecommendationWithAuthor,
  UpsertRecommendationAuthorInput,
  CreateRecommendationInput,
} from "@shared/domain/recommendation";

export type { AuditLog, CreateAuditLogInput } from "@shared/domain/audit-log";

export type {
  LlmChatLog,
  CreateLlmChatLogInput,
} from "@shared/domain/llm-chat-log";
