import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn convention: classnames helper used by every primitive.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
