/**
 * Normalise a user-supplied mount path into either '' (root) or '/segment'
 * with no trailing slash, so every call site can compose it predictably.
 */
export const normalizeBasePath = (basePath?: string) => {
  if (!basePath) return '';
  const trimmed = basePath.replace(/^\/+|\/+$/g, '');
  if (!trimmed) return '';
  return `/${trimmed}`;
};
