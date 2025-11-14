import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with conflict resolution.
 * User-provided classes will override default classes when conflicts exist.
 *
 * @param defaultClasses - Base classes that should be applied
 * @param userClasses - User-provided classes that should override conflicts
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```tsx
 * // Default: h-10 w-0, User: h-12 w-4
 * // Result: h-12 w-4 (user classes override defaults)
 * mergeClasses('h-10 w-0 border', 'h-12 w-4')
 * ```
 */
export function mergeClasses(defaultClasses: string, userClasses?: string): string {
    if (!userClasses) return defaultClasses;
    return twMerge(defaultClasses, userClasses);
}

/**
 * Type-safe version of mergeClasses for component props
 */
export type ClassProp = string | undefined | null;

/**
 * Merge classes with TypeScript safety for component props
 */
export function mergeComponentClasses(defaultClasses: string, userClass: ClassProp, additionalUserClass?: ClassProp): string {
    const userClasses = [userClass, additionalUserClass].filter(Boolean).join(' ');

    return mergeClasses(defaultClasses, userClasses);
}
