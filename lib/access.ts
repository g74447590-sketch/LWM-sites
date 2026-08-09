// The web version is intentionally free while the product is being validated.
// This limit protects the shared beta infrastructure from accidental abuse.
export const FREE_BETA_MAX_PROJECTS = 5;

export const freeBetaAccess = {
  label: "Beta gratuita",
  maxProjects: FREE_BETA_MAX_PROJECTS,
} as const;
