// Production Configuration System
// Location: /lib/config/environment.ts

import { z } from 'zod'

// Environment Schema with Validation
const envSchema = z.object({
  // App Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // AI Provider Keys
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  DEEPINFRA_API_KEY: z.string().optional(),
  
  // Security Configuration
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Monitoring & Analytics
  SENTRY_DSN: z.string().url().optional(),
  VERCEL_ANALYTICS_ID: z.string().optional(),
  POSTHOG_KEY: z.string().optional(),
  
  // Performance & Rate Limiting
  REDIS_URL: z.string().url().optional(),
  RATE_LIMIT_RPM: z.coerce.number().default(60),
  RATE_LIMIT_RPD: z.coerce.number().default(1000),
  
  // Tool Configuration
  CODE_EXECUTION_TIMEOUT: z.coerce.number().default(30000),
  MAX_UPLOAD_SIZE: z.coerce.number().default(10485760), // 10MB
  SANDBOX_MEMORY_LIMIT: z.coerce.number().default(256), // MB
})

type Environment = z.infer<typeof envSchema>

// Validate and parse environment variables
function createEnv(): Environment {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:')
      error.issues.forEach(issue => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
      })
      throw new Error('Invalid environment configuration')
    }
    throw error
  }
}

export const env = createEnv()

// Configuration objects derived from environment
export const appConfig = {
  name: 'NexusAI',
  version: env.NEXT_PUBLIC_APP_VERSION,
  environment: env.NODE_ENV,
  url: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
} as const

export const databaseConfig = {
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
} as const

export const aiConfig = {
  providers: {
    openai: {
      enabled: !!env.OPENAI_API_KEY,
      apiKey: env.OPENAI_API_KEY,
      models: ['gpt-4', 'gpt-4-vision-preview', 'dall-e-3'] as const,
    },
    anthropic: {
      enabled: !!env.ANTHROPIC_API_KEY,
      apiKey: env.ANTHROPIC_API_KEY,
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] as const,
    },
    google: {
      enabled: !!env.GOOGLE_AI_API_KEY,
      apiKey: env.GOOGLE_AI_API_KEY,
      models: ['gemini-pro', 'gemini-pro-vision'] as const,
    },
    groq: {
      enabled: !!env.GROQ_API_KEY,
      apiKey: env.GROQ_API_KEY,
      models: ['llama2-70b-4096', 'mixtral-8x7b-32768'] as const,
    },
  },
} as const

export const securityConfig = {
  rateLimits: {
    requestsPerMinute: env.RATE_LIMIT_RPM,
    requestsPerDay: env.RATE_LIMIT_RPD,
  },
  uploads: {
    maxSize: env.MAX_UPLOAD_SIZE,
    allowedTypes: ['.txt', '.csv', '.json', '.md', '.js', '.ts', '.py'] as const,
  },
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", 'https://vercel.live'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'", 'https://api.openai.com', 'https://api.anthropic.com'],
  },
} as const

export const toolsConfig = {
  codeExecution: {
    timeout: env.CODE_EXECUTION_TIMEOUT,
    memoryLimit: env.SANDBOX_MEMORY_LIMIT,
    allowedLanguages: ['python', 'javascript', 'typescript', 'bash'] as const,
    sandboxType: env.NODE_ENV === 'production' ? 'docker' : 'simulated' as const,
  },
  imageGeneration: {
    defaultModel: 'dall-e-3' as const,
    maxConcurrent: 3,
    cacheDuration: 3600, // 1 hour
  },
  collaboration: {
    maxParticipants: 10,
    sessionTimeout: 7200, // 2 hours
    autoSave: true,
  },
} as const

// Feature flags
export const features = {
  codeExecution: true,
  imageGeneration: !!env.OPENAI_API_KEY,
  collaboration: true,
  dataAnalysis: true,
  uiGeneration: true,
  realTimeSync: !!env.REDIS_URL,
  analytics: !!env.VERCEL_ANALYTICS_ID,
  monitoring: !!env.SENTRY_DSN,
} as const

// Runtime configuration validation
export function validateConfiguration() {
  const issues: string[] = []
  
  // Check required AI providers
  if (!aiConfig.providers.openai.enabled && !aiConfig.providers.anthropic.enabled) {
    issues.push('At least one AI provider (OpenAI or Anthropic) must be configured')
  }
  
  // Check production requirements
  if (appConfig.isProduction) {
    if (!env.NEXTAUTH_SECRET) {
      issues.push('NEXTAUTH_SECRET is required in production')
    }
    if (!env.SENTRY_DSN) {
      issues.push('SENTRY_DSN recommended for production error monitoring')
    }
  }
  
  // Check tool requirements
  if (features.imageGeneration && !aiConfig.providers.openai.enabled) {
    issues.push('OpenAI API key required for image generation')
  }
  
  if (issues.length > 0) {
    console.warn('⚠️  Configuration issues detected:')
    issues.forEach(issue => console.warn(`  - ${issue}`))
    
    if (appConfig.isProduction) {
      throw new Error('Critical configuration issues in production')
    }
  }
  
  return issues.length === 0
}

// Environment-specific configurations
export const getApiUrl = (endpoint: string) => {
  const baseUrl = appConfig.url
  return `${baseUrl}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

export const getAssetUrl = (path: string) => {
  const baseUrl = appConfig.url
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

// Logging configuration
export const loggingConfig = {
  level: appConfig.isProduction ? 'warn' : 'debug',
  enableConsole: !appConfig.isProduction,
  enableFile: appConfig.isProduction,
  enableRemote: !!env.SENTRY_DSN,
}

// Performance monitoring
export const performanceConfig = {
  enableWebVitals: true,
  enableProfiler: !appConfig.isProduction,
  sampleRate: appConfig.isProduction ? 0.1 : 1.0,
}

// Export type-safe configuration
export type AppConfig = typeof appConfig
export type DatabaseConfig = typeof databaseConfig
export type AIConfig = typeof aiConfig
export type SecurityConfig = typeof securityConfig
export type ToolsConfig = typeof toolsConfig
export type Features = typeof features

// Initialize configuration on startup
validateConfiguration()

// ===== .env.example content =====
/*
# Create this file: .env.example

# =============================================================================
# NexusAI Environment Configuration
# =============================================================================

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000

# =============================================================================
# Supabase Configuration
# Get these values from: https://supabase.com/dashboard/project/_/settings/api
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# =============================================================================
# AI Provider API Keys
# =============================================================================

# OpenAI (Required for GPT models and DALL-E)
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your_openai_key_here

# Anthropic (Required for Claude models)  
# Get from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_key_here

# Google AI (Optional - for Gemini models)
# Get from: https://makersuite.google.com/app/apikey
GOOGLE_AI_API_KEY=your_google_ai_key_here

# Groq (Optional - for fast inference)
# Get from: https://console.groq.com/keys
GROQ_API_KEY=your_groq_key_here

# DeepInfra (Optional)
# Get from: https://deepinfra.com/
DEEPINFRA_API_KEY=your_deepinfra_key_here

# =============================================================================
# Security & Authentication
# =============================================================================
NEXTAUTH_SECRET=your_32_character_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# =============================================================================
# Monitoring & Analytics (Optional)
# =============================================================================

# Sentry (Error monitoring)
# Get from: https://sentry.io/
SENTRY_DSN=https://your_sentry_dsn_here

# Vercel Analytics
VERCEL_ANALYTICS_ID=your_analytics_id_here

# PostHog (Product analytics)
POSTHOG_KEY=your_posthog_key_here

# =============================================================================
# Performance & Infrastructure (Optional)
# =============================================================================

# Redis (For rate limiting and caching)
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_RPM=60
RATE_LIMIT_RPD=1000

# Tool Configuration
CODE_EXECUTION_TIMEOUT=30000
MAX_UPLOAD_SIZE=10485760
SANDBOX_MEMORY_LIMIT=256

# =============================================================================
# Development Only (Do not set in production)
# =============================================================================
SKIP_ENV_VALIDATION=false
DISABLE_RATE_LIMITING=false
ENABLE_DEBUG_MODE=true
*/
