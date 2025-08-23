// Enhanced Type System - Strict TypeScript Implementation
// Location: /lib/tools/types.ts

// ===== CORE TOOL TYPES =====

export interface Tool {
  id: string
  name: string
  description: string
  icon: LucideIconName
  category: ToolCategory
  enabled: boolean
  requiresApiKey?: boolean
  apiKeyName?: string
  version?: string
  lastUpdated?: Date
}

export type ToolCategory = "code" | "image" | "ui" | "collaboration" | "analysis" | "data"

export type LucideIconName = 
  | "Code" 
  | "ImageIcon" 
  | "Layout" 
  | "Users" 
  | "BarChart3" 
  | "Database"
  | "Zap"

// ===== EXECUTION TYPES =====

export interface ToolExecution<TInput = unknown, TOutput = unknown> {
  id: string
  toolId: string
  input: TInput
  output: TOutput
  status: ExecutionStatus
  startTime: Date
  endTime?: Date
  error?: ExecutionError
  metadata?: ExecutionMetadata
}

export type ExecutionStatus = "pending" | "running" | "completed" | "error" | "cancelled" | "timeout"

export interface ExecutionError {
  code: string
  message: string
  stack?: string
  context?: Record<string, unknown>
}

export interface ExecutionMetadata {
  executionTime: number
  memoryUsage?: number
  resourceUsage?: ResourceUsage
  securityLevel?: SecurityLevel
}

export interface ResourceUsage {
  cpu: number
  memory: number
  network?: number
}

export type SecurityLevel = "safe" | "moderate" | "restricted" | "blocked"

// ===== CODE EXECUTION TYPES =====

export interface CodeExecutionRequest {
  code: string
  language: SupportedLanguage
  timeout?: number
  memoryLimit?: number
  requirements?: string[]
  environment?: ExecutionEnvironment
}

export interface CodeExecutionResult {
  output: string
  error?: string
  executionTime: number
  exitCode: number
  securityReport?: SecurityReport
  resourceUsage?: ResourceUsage
}

export type SupportedLanguage = "python" | "javascript" | "typescript" | "bash" | "sql"

export interface ExecutionEnvironment {
  platform: "docker" | "wasm" | "vm" | "native"
  version?: string
  allowedModules?: string[]
  environmentVariables?: Record<string, string>
}

export interface SecurityReport {
  threats: SecurityThreat[]
  riskLevel: SecurityLevel
  blockedOperations: string[]
  allowedOperations: string[]
}

export interface SecurityThreat {
  type: ThreatType
  severity: "low" | "medium" | "high" | "critical"
  description: string
  line?: number
  suggestion?: string
}

export type ThreatType = 
  | "file_system_access"
  | "network_request" 
  | "subprocess_execution"
  | "dangerous_builtin"
  | "memory_exhaustion"
  | "infinite_loop"

// ===== IMAGE GENERATION TYPES =====

export interface ImageGenerationRequest {
  prompt: string
  model: ImageModel
  size?: ImageSize
  quality?: ImageQuality
  style?: ImageStyle
  negativePrompt?: string
  steps?: number
  guidance?: number
}

export interface ImageGenerationResult {
  imageUrl: string
  revisedPrompt?: string
  model: ImageModel
  metadata: ImageMetadata
  cost?: number
}

export type ImageModel = "dall-e-3" | "dall-e-2" | "stable-diffusion" | "midjourney"

export type ImageSize = 
  | "256x256" 
  | "512x512" 
  | "1024x1024" 
  | "1792x1024" 
  | "1024x1792"

export type ImageQuality = "standard" | "hd" | "ultra"

export type ImageStyle = "vivid" | "natural" | "artistic" | "photorealistic"

export interface ImageMetadata {
  dimensions: {
    width: number
    height: number
  }
  format: string
  size: number
  generatedAt: Date
  seed?: number
  steps?: number
}

// ===== UI GENERATION TYPES =====

export interface UIGenerationRequest {
  prompt: string
  framework: UIFramework
  styling: StylingMethod
  complexity: ComplexityLevel
  features?: UIFeature[]
  constraints?: UIConstraints
}

export interface UIGenerationResult {
  code: string
  preview?: string
  framework: UIFramework
  dependencies: Dependency[]
  assets?: Asset[]
  documentation?: string
}

export type UIFramework = "react" | "vue" | "svelte" | "html" | "angular"

export type StylingMethod = "tailwind" | "css" | "styled-components" | "scss" | "css-modules"

export type ComplexityLevel = "simple" | "medium" | "complex" | "enterprise"

export type UIFeature = 
  | "responsive" 
  | "dark-mode" 
  | "animations" 
  | "form-validation" 
  | "state-management"
  | "accessibility"
  | "internationalization"

export interface UIConstraints {
  maxComponents?: number
  browserSupport?: string[]
  performanceRequirements?: PerformanceRequirements
  accessibilityLevel?: AccessibilityLevel
}

export interface PerformanceRequirements {
  maxBundleSize?: number
  targetLCP?: number
  targetFID?: number
  targetCLS?: number
}

export type AccessibilityLevel = "aa" | "aaa" | "basic"

export interface Dependency {
  name: string
  version: string
  type: "runtime" | "dev" | "peer"
  required: boolean
  description?: string
}

export interface Asset {
  name: string
  type: "image" | "font" | "icon" | "data"
  url: string
  size?: number
}

// ===== COLLABORATION TYPES =====

export interface CollaborationSession {
  id: string
  name: string
  participants: Participant[]
  status: SessionStatus
  createdAt: Date
  updatedAt: Date
  settings: SessionSettings
}

export interface Participant {
  id: string
  name: string
  role: ParticipantRole
  isActive: boolean
  joinedAt: Date
  permissions: Permission[]
}

export type ParticipantRole = "owner" | "admin" | "member" | "viewer" | "guest"

export type SessionStatus = "active" | "paused" | "completed" | "archived"

export interface SessionSettings {
  isPublic: boolean
  allowAnonymous: boolean
  maxParticipants: number
  autoSave: boolean
  recordSession: boolean
}

export type Permission = 
  | "read" 
  | "write" 
  | "execute" 
  | "admin" 
  | "invite" 
  | "export"

// ===== DATA ANALYSIS TYPES =====

export interface DataAnalysisRequest {
  data: DataSource
  analysisType: AnalysisType[]
  options?: AnalysisOptions
}

export interface DataAnalysisResult {
  insights: Insight[]
  visualizations: Visualization[]
  statistics: Statistics
  recommendations: Recommendation[]
}

export interface DataSource {
  type: DataSourceType
  content: string | File | URL
  format: DataFormat
  schema?: DataSchema
}

export type DataSourceType = "file" | "url" | "database" | "api" | "clipboard"

export type DataFormat = "csv" | "json" | "xlsx" | "parquet" | "sql"

export interface DataSchema {
  columns: ColumnDefinition[]
  rowCount?: number
  primaryKey?: string
}

export interface ColumnDefinition {
  name: string
  type: DataType
  nullable: boolean
  unique?: boolean
  description?: string
}

export type DataType = "string" | "number" | "boolean" | "date" | "array" | "object"

export type AnalysisType = 
  | "descriptive" 
  | "correlation" 
  | "regression" 
  | "clustering" 
  | "classification"
  | "time-series"
  | "anomaly-detection"

export interface AnalysisOptions {
  confidence?: number
  sampleSize?: number
  excludeColumns?: string[]
  customParameters?: Record<string, unknown>
}

export interface Insight {
  type: InsightType
  title: string
  description: string
  confidence: number
  significance?: number
  data?: unknown
}

export type InsightType = 
  | "trend" 
  | "anomaly" 
  | "correlation" 
  | "pattern" 
  | "outlier"
  | "seasonality"

export interface Visualization {
  id: string
  type: VisualizationType
  title: string
  description?: string
  data: unknown
  config: VisualizationConfig
}

export type VisualizationType = 
  | "line" 
  | "bar" 
  | "scatter" 
  | "histogram" 
  | "heatmap"
  | "pie"
  | "treemap"
  | "sankey"

export interface VisualizationConfig {
  width?: number
  height?: number
  theme?: "light" | "dark"
  interactive?: boolean
  exportable?: boolean
  customOptions?: Record<string, unknown>
}

export interface Statistics {
  summary: SummaryStats
  distributions: DistributionStats[]
  correlations?: CorrelationMatrix
}

export interface SummaryStats {
  rowCount: number
  columnCount: number
  nullCount: number
  duplicateCount: number
  memoryUsage: number
}

export interface DistributionStats {
  column: string
  mean?: number
  median?: number
  mode?: unknown
  std?: number
  min?: unknown
  max?: unknown
  quartiles?: number[]
  skewness?: number
  kurtosis?: number
}

export interface CorrelationMatrix {
  columns: string[]
  matrix: number[][]
}

export interface Recommendation {
  type: RecommendationType
  priority: "low" | "medium" | "high"
  title: string
  description: string
  action?: RecommendedAction
}

export type RecommendationType = 
  | "data-quality" 
  | "performance" 
  | "visualization" 
  | "analysis"
  | "modeling"

export interface RecommendedAction {
  type: "transform" | "clean" | "visualize" | "model" | "export"
  parameters?: Record<string, unknown>
  code?: string
}

// ===== UTILITY TYPES =====

export type ApiResponse<T> = {
  success: true
  data: T
  metadata?: ResponseMetadata
} | {
  success: false
  error: ApiError
  metadata?: ResponseMetadata
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: Date
}

export interface ResponseMetadata {
  requestId: string
  timestamp: Date
  processingTime: number
  version: string
}

// Event types for real-time updates
export interface ToolEvent<T = unknown> {
  type: ToolEventType
  toolId: string
  executionId?: string
  data: T
  timestamp: Date
}

export type ToolEventType = 
  | "execution-started"
  | "execution-progress" 
  | "execution-completed"
  | "execution-failed"
  | "tool-enabled"
  | "tool-disabled"

// Configuration types
export interface ToolConfiguration {
  [toolId: string]: ToolConfig
}

export interface ToolConfig {
  enabled: boolean
  apiKeys?: Record<string, string>
  settings?: Record<string, unknown>
  limits?: UsageLimits
}

export interface UsageLimits {
  requestsPerMinute?: number
  requestsPerDay?: number
  maxExecutionTime?: number
  maxMemoryUsage?: number
}

// Type guards for runtime type checking
export function isCodeExecutionRequest(obj: unknown): obj is CodeExecutionRequest {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'code' in obj &&
    'language' in obj &&
    typeof (obj as any).code === 'string' &&
    typeof (obj as any).language === 'string'
  )
}

export function isImageGenerationRequest(obj: unknown): obj is ImageGenerationRequest {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'prompt' in obj &&
    'model' in obj &&
    typeof (obj as any).prompt === 'string' &&
    typeof (obj as any).model === 'string'
  )
}

export function isUIGenerationRequest(obj: unknown): obj is UIGenerationRequest {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'prompt' in obj &&
    'framework' in obj &&
    typeof (obj as any).prompt === 'string' &&
    typeof (obj as any).framework === 'string'
  )
}
