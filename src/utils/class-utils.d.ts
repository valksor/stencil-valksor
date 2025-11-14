/**
 * Type definitions for class utilities
 */

export type ClassProp = string | undefined | null;

/**
 * Utility function to merge Tailwind CSS classes with conflict resolution.
 * User-provided classes will override default classes when conflicts exist.
 */
export declare function mergeClasses(defaultClasses: string, userClasses?: string): string;

/**
 * Merge classes with TypeScript safety for component props
 */
export declare function mergeComponentClasses(defaultClasses: string, userClass: ClassProp, additionalUserClass?: ClassProp): string;
