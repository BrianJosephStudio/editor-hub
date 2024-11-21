export {}

// Create a type for the roles
export type Roles = 'admin' | 'moderator' | 'clip_tagger' | 'project_manager'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}