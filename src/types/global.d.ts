export {}

// Create a type for the roles
export type Roles = 'admin' | 'moderator' | 'clip_tagger' | 'project_manager' | 'editor' | 'animator'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles,
      roles?: Roles[]
    }
  }
}