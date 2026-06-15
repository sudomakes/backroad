import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn convention: the classname helper used by every primitive. Lives in
// backroad-components so both the leaf renderers here and the app shell in
// backroad-frontend can share one set of UI primitives.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
